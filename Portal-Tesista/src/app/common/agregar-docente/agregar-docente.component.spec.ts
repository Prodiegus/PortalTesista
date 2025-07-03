import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarDocenteComponent } from './agregar-docente.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { HttpRequestService } from '../Http-request.service';
import { of, throwError } from 'rxjs';

describe('AgregarDocenteComponent', () => {
  let component: AgregarDocenteComponent;
  let fixture: ComponentFixture<AgregarDocenteComponent>;
  let mockHttpService: jasmine.SpyObj<HttpRequestService>;
  let mockElementRef: ElementRef;

  beforeEach(async () => {
    mockHttpService = jasmine.createSpyObj('HttpRequestService', ['addDocente']);
    mockElementRef = {
      nativeElement: {
        contains: jasmine.createSpy().and.returnValue(true)
      }
    };

    await TestBed.configureTestingModule({
      declarations: [AgregarDocenteComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        { provide: HttpRequestService, useValue: mockHttpService },
        { provide: ElementRef, useValue: mockElementRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarDocenteComponent);
    component = fixture.componentInstance;
    component.userRepresentation = { escuela: 'Ingeniería' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close on closeOverlay()', () => {
    spyOn(component.close, 'emit');
    component.closeOverlay();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should handle click outside the component and call closeOverlay()', () => {
    mockElementRef.nativeElement.contains.and.returnValue(false);
    spyOn(component, 'closeOverlay');
    component.clickout(new MouseEvent('click'));
    expect(component.closeOverlay).toHaveBeenCalled();
  });

  it('should not submit if fields are empty', async () => {
    spyOn<any>(component, 'add');
    await component.onSubmit();
    expect(component['add']).not.toHaveBeenCalled();
  });

  it('should call add() and closeOverlay() on successful submit', async () => {
    spyOn(component, 'closeOverlay');
    mockHttpService.addDocente.and.returnValue(Promise.resolve(of({ success: true })));

    component.nombre = 'Juan';
    component.apellido = 'Pérez';
    component.rut = '12345678-9';
    component.correo = 'juan@ejemplo.com';
    component.tipo = 'Titular';

    await component.onSubmit();

    expect(mockHttpService.addDocente).toHaveBeenCalledWith(jasmine.objectContaining({
      nombre: 'Juan',
      apellido: 'Pérez',
      rut: '12345678-9',
      correo: 'juan@ejemplo.com',
      escuela: 'Ingeniería',
      tipo: 'Titular',
      activo: 1
    }));
    expect(component.closeOverlay).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should handle error in add()', async () => {
    spyOn(console, 'log');
    spyOn(component, 'closeOverlay');
    mockHttpService.addDocente.and.returnValue(Promise.resolve(
      throwError(() => new Error('network error'))
    ));

    component.nombre = 'Ana';
    component.apellido = 'Gómez';
    component.rut = '98765432-1';
    component.correo = 'ana@ejemplo.com';
    component.tipo = 'Adjunto';

    await component.onSubmit();

    expect(console.log).toHaveBeenCalledWith('Error adding docente');
    expect(component.closeOverlay).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });
});
