import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvanceTemaComponent } from './avance-tema.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DateFormatPipe } from '../../pipe/date-format.pipe';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule } from '@angular/forms';
import { CONST } from '../const/const';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('AvanceTemaComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: AvanceTemaComponent;
  let fixture: ComponentFixture<AvanceTemaComponent>;
  let mockHttpRequestService: any;
  let mockDialog: any;

  beforeEach(async () => {
    mockHttpRequestService = {
      calificarAvance: jasmine.createSpy('calificarAvance').and.returnValue(Promise.resolve(of({}))),
      empezarRevisionAvance: jasmine.createSpy('empezarRevisionAvance').and.returnValue(Promise.resolve(of({}))),
    };
    mockDialog = { open: jasmine.createSpy('open') };

    await TestBed.configureTestingModule({
      declarations: [AvanceTemaComponent, DateFormatPipe],
      imports: [HttpClientTestingModule, PdfViewerModule, FormsModule],
      providers: [
        { provide: 'HttpRequestService', useValue: mockHttpRequestService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).overrideComponent(AvanceTemaComponent, {
      set: {
        providers: [
          { provide: 'HttpRequestService', useValue: mockHttpRequestService },
          { provide: MatDialog, useValue: mockDialog }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(AvanceTemaComponent);
    component = fixture.componentInstance;
    component.userRepresentation = CONST.userRepresentation;
    component.tema = CONST.temas[0];
    component.avance = {
      ...CONST.avances[0],
      archivo: 'dGVzdA==', // base64 de 'test'
      feedback: { archivo: 'dGVzdA==', nombre_archivo: 'retro.pdf' }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set pdfSrc on ngOnInit if avance.archivo exists', () => {
    component.avance.archivo = 'dGVzdA==';
    component.ngOnInit();
    expect(component.pdfSrc).toContain('data:application/pdf;base64,');
  });

  it('should set pdfSrc undefined if no archivo', () => {
    component.avance.archivo = '';
    component.ngOnInit();
    expect(component.pdfSrc).toBeUndefined();
  });

  it('should emit close on cerrar()', () => {
    spyOn(component.close, 'emit');
    component.cerrar();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should call evaluarAvance on onGuardar if revision', async () => {
    component.revision = true;
    spyOn(component, 'evaluarAvance').and.returnValue(Promise.resolve());
    await component.onGuardar();
    expect(component.evaluarAvance).toHaveBeenCalled();
  });

  it('should call subirGuiaReview on onGuardar if not revision', async () => {
    component.revision = false;
    spyOn(component, 'subirGuiaReview').and.returnValue(Promise.resolve());
    await component.onGuardar();
    expect(component.subirGuiaReview).toHaveBeenCalled();
  });

  it('should set totalPages and pageInput on onPdfLoad', () => {
    component.page = 2;
    component.onPdfLoad({ numPages: 5 });
    expect(component.totalPages).toBe(5);
    expect(component.pageInput).toBe(2);
  });

  it('should go to next and previous page', () => {
    component.totalPages = 3;
    component.page = 2;
    component.goToNextPage();
    expect(component.page).toBe(3);
    component.goToPreviousPage();
    expect(component.page).toBe(2);
  });

  it('should zoom in and out', () => {
    component.zoom = 1;
    component.zoomIn();
    expect(component.zoom).toBeCloseTo(1.1, 1);
    component.zoomOut();
    expect(component.zoom).toBeCloseTo(1, 1);
  });

  it('should not zoom out below 0.2', () => {
    component.zoom = 0.2;
    component.zoomOut();
    expect(component.zoom).toBe(0.2);
  });

  it('should handle descargarArchivo with no archivo', () => {
    spyOn(console, 'error');
    component.descargarArchivo(null, 'test.pdf');
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle descargarFeedbackArchivo with no feedback', () => {
    component.avance.feedback = null;
    spyOn(console, 'error');
    component.descargarFeedbackArchivo();
    expect(console.error).toHaveBeenCalled();
  });
});
