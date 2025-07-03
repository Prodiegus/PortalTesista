import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvanceTemaComponent } from './avance-tema.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { HttpRequestService } from '../Http-request.service';
import { DateFormatPipe } from '../../pipe/date-format.pipe';
import { CONST } from '../const/const';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

describe('AvanceTemaComponent', () => {
  let component: AvanceTemaComponent;
  let fixture: ComponentFixture<AvanceTemaComponent>;
  let httpServiceSpy: jasmine.SpyObj<HttpRequestService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let originalCreateObjectURL: any;
  let originalRevokeObjectURL: any;

  beforeAll(() => {
    // Capturamos y spyeamos URL.createObjectURL/revokeObjectURL
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;
    spyOn(URL, 'createObjectURL').and.returnValue('blob:url');
    spyOn(URL, 'revokeObjectURL').and.stub();
  });

  afterAll(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  beforeEach(async () => {
    httpServiceSpy = jasmine.createSpyObj('HttpRequestService', ['calificarAvance', 'empezarRevisionAvance']);
    httpServiceSpy.calificarAvance.and.returnValue(Promise.resolve(of({})));
    httpServiceSpy.empezarRevisionAvance.and.returnValue(Promise.resolve(of({})));

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [AvanceTemaComponent, DateFormatPipe],
      imports: [HttpClientTestingModule, PdfViewerModule, FormsModule],
      providers: [
        { provide: HttpRequestService, useValue: httpServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AvanceTemaComponent);
    component = fixture.componentInstance;

    // Datos base
    component.tema = { id: 1, titulo: 'Tema X' };
    component.userRepresentation = CONST.userRepresentation;
    component.avance = {
      id: 10,
      archivo: 'dGVzdDEyMw==', // base64 de 'test123'
      feedback: {
        archivo: 'cmV0cm8xMjM=', // base64 de 'retro123'
        nombre_archivo: 'retro.pdf'
      },
      nota: 5,
      aprobado: true,
      comentarios: 'Ok'
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit & pdfSrc', () => {
    it('prefixes archivo without data URL', () => {
      component.avance.archivo = 'abcd';
      component.ngOnInit();
      expect(component.pdfSrc).toBe('data:application/pdf;base64,abcd');
    });

    it('keeps prefix if already present', () => {
      component.avance.archivo = 'data:application/pdf;base64,xyz';
      component.ngOnInit();
      expect(component.pdfSrc).toBe('data:application/pdf;base64,xyz');
    });

    it('sets pdfSrc undefined if archivo blank', () => {
      component.avance.archivo = '   ';
      component.ngOnInit();
      expect(component.pdfSrc).toBeUndefined();
    });
  });

  it('should emit close on cerrar()', () => {
    spyOn(component.close, 'emit');
    component.cerrar();
    expect(component.close.emit).toHaveBeenCalled();
  });

  describe('page navigation', () => {
    beforeEach(() => {
      component.totalPages = 5;
      component.page = 2;
      component.pageInput = 2;
    });

    it('goToNextPage respects upper bound', () => {
      component.goToNextPage();
      expect(component.page).toBe(3);
      component.page = 5;
      component.goToNextPage();
      expect(component.page).toBe(5);
    });

    it('goToPreviousPage respects lower bound', () => {
      component.goToPreviousPage();
      expect(component.page).toBe(1);
      component.page = 1;
      component.goToPreviousPage();
      expect(component.page).toBe(1);
    });

    it('goToPage sets page when in range', () => {
      component.pageInput = 4;
      component.totalPages = 5;
      component.goToPage();
      expect(component.page).toBe(4);
    });

    it('goToPage does not set page when out of range', () => {
      component.pageInput = 6;
      component.page = 2;
      component.totalPages = 5;
      component.goToPage();
      expect(component.page).toBe(2);
    });

    it('onPdfLoad sets totalPages and pageInput', () => {
      component.page = 3;
      component.onPdfLoad({ numPages: 7 });
      expect(component.totalPages).toBe(7);
      expect(component.pageInput).toBe(3);
    });
  });

  describe('zoom', () => {
    it('zoomIn increases zoom by 0.1', () => {
      component.zoom = 1.0;
      component.zoomIn();
      expect(component.zoom).toBeCloseTo(1.1, 3);
    });
    it('zoomOut decreases zoom by 0.1 but not below 0.2', () => {
      component.zoom = 0.3;
      component.zoomOut();
      expect(component.zoom).toBeCloseTo(0.2, 3);
      component.zoom = 0.2;
      component.zoomOut();
      expect(component.zoom).toBe(0.2);
    });
  });

  describe('descargarArchivo', () => {
    let anchorSpy: jasmine.Spy;

    beforeEach(() => {
      anchorSpy = spyOn(document, 'createElement').and.callFake((tag: string) => {
        const a = document.createElementNS('http://www.w3.org/1999/xhtml', tag) as HTMLAnchorElement;
        spyOn(a, 'click').and.stub();
        return a;
      });
    });

    it('logs error if no archivo', () => {
      const consoleSpy = spyOn(console, 'error');
      component.descargarArchivo(null, 'file.pdf');
      expect(consoleSpy).toHaveBeenCalledWith('No file available to download');
    });

    it('creates and clicks link for valid base64', () => {
      // archivo sin prefijo
      component.descargarArchivo('ZGF0YQ==', 'my.pdf');
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(anchorSpy).toHaveBeenCalledWith('a');
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('feedback file selection', () => {
    it('processes PDF correctly', (done) => {
      const dummyFile = new File(['dummy'], 'f.pdf', { type: 'application/pdf' });
      const event = { target: { files: [dummyFile] } } as any;

      spyOn(FileReader.prototype, 'readAsDataURL').and.callFake(function (this: FileReader) {
        Object.defineProperty(this, 'result', {
          value: 'data:application/pdf;base64,AAA',
          writable: false,
          configurable: true
        });
        // Llamamos onload con un ProgressEvent vacío
        this.onload!({} as ProgressEvent<FileReader>);
      });


      component.avance.feedback = null;
      component.onFeedbackFileSelected(event);

      expect(component.avance.feedback).toEqual({
        archivo: 'AAA',
        nombre_archivo: 'f.pdf'
      });
      done();
    });

    it('opens dialog for non-PDF', () => {
      const txt = new File(['txt'], 'txt.txt', { type: 'text/plain' });
      const event = { target: { files: [txt] } } as any;
      component.onFeedbackFileSelected(event);
      expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'Aviso',
          message: 'Solo se acepta PDF.',
          confirmButtonText: 'Aceptar',
          isAlert: true,
        }
      });
    });

    it('sets feedback null if no files', () => {
      component.avance.feedback = { archivo: 'X', nombre_archivo: 'Y' };
      component.onFeedbackFileSelected({ target: { files: [] } } as any);
      expect(component.avance.feedback).toBeNull();
    });
  });

  describe('descargarFeedbackArchivo', () => {
    it('logs error if no feedback', () => {
      component.avance.feedback = null as any;
      const spy = spyOn(console, 'error');
      component.descargarFeedbackArchivo();
      expect(spy).toHaveBeenCalledWith('No feedback file available to download');
    });

    it('downloads feedback correctly', () => {
      // feedback ya está seteado en beforeEach
      component.descargarFeedbackArchivo();
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('fallsthrough to descargarArchivo on error', () => {
      // fuerzamos excepción en atob
      spyOn(window, 'atob').and.throwError('fail');
      const spyDesc = spyOn(component, 'descargarArchivo').and.stub();
      component.descargarFeedbackArchivo();
      expect(spyDesc).toHaveBeenCalled();
    });
  });

  describe('onGuardar', () => {
    it('calls evaluarAvance when revision=true', async () => {
      component.revision = true;
      spyOn(component, 'evaluarAvance').and.returnValue(Promise.resolve());
      await component.onGuardar();
      expect(component.evaluarAvance).toHaveBeenCalledWith(jasmine.objectContaining({
        id_avance: component.avance.id,
        id_tema: component.tema.id
      }));
    });
    it('calls subirGuiaReview when revision=false', async () => {
      component.revision = false;
      spyOn(component, 'subirGuiaReview').and.returnValue(Promise.resolve());
      await component.onGuardar();
      expect(component.subirGuiaReview).toHaveBeenCalled();
    });
  });

  describe('service methods', () => {
    it('evaluarAvance resolves', async () => {
      await expectAsync(component.evaluarAvance({ algo: 1 })).toBeResolved();
      expect(httpServiceSpy.calificarAvance).toHaveBeenCalled();
    });
    it('subirGuiaReview logs and resolves', async () => {
      const consoleSpy = spyOn(console, 'log');
      await expectAsync(component.subirGuiaReview({ foo: 'bar' })).toBeResolved();
      expect(consoleSpy).toHaveBeenCalledWith('Revision started successfully');
      expect(httpServiceSpy.empezarRevisionAvance).toHaveBeenCalled();
    });
    it('subirGuiaReview rejects on error', async () => {
      httpServiceSpy.empezarRevisionAvance.and.returnValue(Promise.resolve(throwError(() => 'err')));
      await expectAsync(component.subirGuiaReview({})).toBeRejected();
    });
  });
});
