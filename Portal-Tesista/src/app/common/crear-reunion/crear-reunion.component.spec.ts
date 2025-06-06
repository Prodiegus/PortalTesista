import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CrearReunionComponent } from './crear-reunion.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HttpRequestService } from '../Http-request.service';

describe('CrearReunionComponent', () => {
  let component: CrearReunionComponent;
  let fixture: ComponentFixture<CrearReunionComponent>;
  let httpRequestServiceSpy: jasmine.SpyObj<HttpRequestService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('HttpRequestService', ['crearReuniones']);

    await TestBed.configureTestingModule({
      declarations: [CrearReunionComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        { provide: HttpRequestService, useValue: spy },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearReunionComponent);
    component = fixture.componentInstance;
    httpRequestServiceSpy = TestBed.inject(HttpRequestService) as jasmine.SpyObj<HttpRequestService>;
    component.tema = { id: 1 };
    component.userRepresentation = { rut: '12345678-9' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close when closeOverlay is called', () => {
    spyOn(component.close, 'emit');
    component.closeOverlay();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should update frecuencia correctly', () => {
    component.fecha_inicio = new Date('2025-06-01');
    component.frecuencia = 'semanal';
    component.actualizarFrecuencia();
    expect(component.frecuencia_dias).toBe(7);

    component.frecuencia = 'diaria';
    component.actualizarFrecuencia();
    expect(component.frecuencia_dias).toBe(1);

    component.frecuencia = 'bisemanal';
    component.actualizarFrecuencia();
    expect(component.frecuencia_dias).toBe(14);

    component.frecuencia = 'unica';
    component.actualizarFrecuencia();
    expect(component.frecuencia_dias).toBe(0);
    expect(component.fecha_termino.toDateString()).toBe(component.fecha_inicio.toDateString());
  });

  it('should call crearReuniones and closeOverlay on success', fakeAsync(() => {
    const mockResponse = { success: true };
    const subscribeSpy = of(mockResponse);
    httpRequestServiceSpy.crearReuniones.and.returnValue(Promise.resolve(subscribeSpy));
    spyOn(component, 'closeOverlay');

    component.crearReunion();
    tick();
    expect(httpRequestServiceSpy.crearReuniones).toHaveBeenCalled();
    expect(component.closeOverlay).toHaveBeenCalled();
  }));

  xit('should handle error when crearReuniones fails', fakeAsync(() => {
    const errorResponse = throwError(() => new Error('Error en API'));
    httpRequestServiceSpy.crearReuniones.and.returnValue(Promise.resolve(errorResponse));

    component.crearReunion();
    tick();
    expect(component.error).toBeTrue();
    expect(component.loading).toBeFalse();
  }));

  it('should emit close when cancelar is called', () => {
    spyOn(component, 'closeOverlay');
    component.cancelar();
    expect(component.closeOverlay).toHaveBeenCalled();
  });
});
