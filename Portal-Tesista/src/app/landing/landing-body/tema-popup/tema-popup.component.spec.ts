import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemaPopupComponent } from './tema-popup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DateFormatPipe } from '../../../pipe/date-format.pipe';
import { CONST } from '../../../common/const/const';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ElementRef } from '@angular/core';
import { HttpRequestService } from '../../../common/Http-request.service';

describe('TemaPopupComponent', () => {
  let component: TemaPopupComponent;
  let fixture: ComponentFixture<TemaPopupComponent>;
  let mockHttpRequestService: any;
  let mockDialog: any;
  let mockElementRef: any;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  beforeEach(async () => {
    // Por defecto, el servicio retorna un Observable con dato válido
    mockHttpRequestService = {
      getUltimoAvanceTema: jasmine
        .createSpy('getUltimoAvanceTema')
        .and.callFake(() =>
          Promise.resolve(
            of({
              archivo: 'dGVzdA==',
              nombre_archivo: 'avance.pdf'
            })
          )
        )
    };

    mockDialog = { open: jasmine.createSpy('open') };
    mockElementRef = {
      nativeElement: {
        contains: jasmine.createSpy('contains').and.returnValue(false)
      }
    };

    await TestBed.configureTestingModule({
      declarations: [TemaPopupComponent, DateFormatPipe],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HttpRequestService, useValue: mockHttpRequestService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ElementRef, useValue: mockElementRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TemaPopupComponent);
    component = fixture.componentInstance;
    component.tema = CONST.temas[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close on closeOverlay', () => {
    spyOn(component.close, 'emit');
    component.closeOverlay();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit solicitar on solicitarTema', () => {
    spyOn(component.solicitar, 'emit');
    component.solicitarTema();
    expect(component.solicitar.emit).toHaveBeenCalled();
  });

  it('should call descargarArchivo if avance exists after descargarTema', async () => {
    spyOn(component, 'descargarArchivo').and.callFake(() => {});
    await component.descargarTema();
    expect(component.descargarArchivo).toHaveBeenCalledWith('dGVzdA==', 'avance.pdf');
    expect(component.descargando).toBeFalse();
  });

  it('should open dialog if no avance after descargarTema', async () => {
    // Simula que el servicio devuelve un Observable<null>
    mockHttpRequestService.getUltimoAvanceTema.and.returnValue(Promise.resolve(of(null)));
    spyOn(component, 'descargarArchivo').and.callFake(() => {});
    await component.descargarTema();
    expect(mockDialog.open).toHaveBeenCalled();
    expect(component.descargarArchivo).not.toHaveBeenCalled();
    expect(component.descargando).toBeFalse();
  });

  it('should handle error in descargarTema', async () => {
    // Simula error en el Observable
    mockHttpRequestService.getUltimoAvanceTema.and.returnValue(
      Promise.resolve(throwError(() => 'fail'))
    );
    const consoleSpy = spyOn(console, 'error');
    await component.descargarTema();
    // Se entra en catch y luego al finally
    expect(consoleSpy).toHaveBeenCalledWith('Error descargando tema:', 'fail');
    expect(component.descargando).toBeFalse();
  });

  it('should call closeOverlay on clickout if clicked outside', () => {
    spyOn(component, 'closeOverlay');
    const fakeElement = document.createElement('div');
    mockElementRef.nativeElement.contains.and.returnValue(false);

    component.clickout({ target: fakeElement } as unknown as MouseEvent);

    expect(component.closeOverlay).toHaveBeenCalled();
  });

  xit('should not call closeOverlay on clickout if clicked inside', () => {
    spyOn(component, 'closeOverlay');
    const fakeElement = document.createElement('div');
    mockElementRef.nativeElement.contains.and.returnValue(true);
    component.clickout({ target: fakeElement } as unknown as MouseEvent);
    expect(component.closeOverlay).not.toHaveBeenCalled();
  });

  it('should log error if descargarArchivo is called with no archivo', () => {
    const consoleSpy = spyOn(console, 'error');
    component.descargarArchivo(null, 'test.pdf');
    expect(consoleSpy).toHaveBeenCalledWith('No file available to download');
  });
});
