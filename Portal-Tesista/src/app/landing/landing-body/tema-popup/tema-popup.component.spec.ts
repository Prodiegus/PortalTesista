import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemaPopupComponent } from './tema-popup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DateFormatPipe } from '../../../pipe/date-format.pipe';
import { CONST } from '../../../common/const/const';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ElementRef } from '@angular/core';

describe('TemaPopupComponent', () => {
  let component: TemaPopupComponent;
  let fixture: ComponentFixture<TemaPopupComponent>;
  let mockHttpRequestService: any;
  let mockDialog: any;
  let mockElementRef: any;

  beforeEach(async () => {
    mockHttpRequestService = {
      getUltimoAvanceTema: jasmine.createSpy('getUltimoAvanceTema').and.returnValue(Promise.resolve(of({
        archivo: 'dGVzdA==', // base64 de 'test'
        nombre_archivo: 'avance.pdf'
      })))
    };
    mockDialog = { open: jasmine.createSpy('open') };
    mockElementRef = { nativeElement: { contains: () => false } };

    await TestBed.configureTestingModule({
      declarations: [TemaPopupComponent, DateFormatPipe],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: 'HttpRequestService', useValue: mockHttpRequestService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ElementRef, useValue: mockElementRef }
      ]
    }).overrideComponent(TemaPopupComponent, {
      set: {
        providers: [
          { provide: 'HttpRequestService', useValue: mockHttpRequestService },
          { provide: MatDialog, useValue: mockDialog },
          { provide: ElementRef, useValue: mockElementRef }
        ]
      }
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

  xit('should call descargarArchivo if avance exists after descargarTema', async () => {
    spyOn(component, 'descargarArchivo');
    await component.descargarTema();
    expect(component.descargarArchivo).toHaveBeenCalledWith('dGVzdA==', 'avance.pdf');
    expect(component.descargando).toBeFalse();
  });

  xit('should open dialog if no avance after descargarTema', async () => {
    mockHttpRequestService.getUltimoAvanceTema.and.returnValue(Promise.resolve(of(null)));
    component.avance = null;
    await component.descargarTema();
    expect(mockDialog.open).toHaveBeenCalled();
    expect(component.descargando).toBeFalse();
  });

  xit('should handle error in descargarTema', async () => {
    mockHttpRequestService.getUltimoAvanceTema.and.returnValue(Promise.reject('fail'));
    const spy = spyOn(console, 'error');
    await component.descargarTema();
    expect(spy).toHaveBeenCalled();
    expect(component.descargando).toBeFalse();
  });

  it('should call closeOverlay on clickout if clicked outside', () => {
    spyOn(component, 'closeOverlay');
    component.clickout({ target: null } as any);
    expect(component.closeOverlay).toHaveBeenCalled();
  });

  xit('should not call closeOverlay on clickout if clicked inside', () => {
    mockElementRef.nativeElement.contains = () => true;
    spyOn(component, 'closeOverlay');
    component.clickout({ target: null } as any);
    expect(component.closeOverlay).not.toHaveBeenCalled();
  });

  it('should log error if descargarArchivo is called with no archivo', () => {
    const spy = spyOn(console, 'error');
    component.descargarArchivo(null, 'test.pdf');
    expect(spy).toHaveBeenCalledWith('No file available to download');
  });
});