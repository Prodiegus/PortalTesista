import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarFaseFlujoComponent } from './agregar-fase-flujo.component';
import {Router} from '@angular/router';
import {CONST} from '../const/const';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';


describe('AgregarFaseFlujoComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: AgregarFaseFlujoComponent;
  let fixture: ComponentFixture<AgregarFaseFlujoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarFaseFlujoComponent],
      providers:  [
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => ({
              extras: {
                state: {
                  userRepresentation: CONST.userRepresentation,
                  tema: CONST.temas[0]
                }
              }
            }),
            navigate: jasmine.createSpy('navigate')
          }
        }
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarFaseFlujoComponent);
    component = fixture.componentInstance;

    component.userRepresentation = CONST.userRepresentation;
    component.id_flujo = 1; // Assuming a default value for id_flujo
    component.tipo = 'guia'; // Assuming a default value for tipo
    component.numero = 1; // Assuming a default value for numero

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return if form data is empty', async () => {
    component.nombre = '';
    component.descripcion = '';
    component.fecha_inicio = '';
    component.fecha_termino = '';

    spyOn<any>(component, 'add');
    await component.onSubmit();

    expect(component.loading).toBeFalse();
    expect(component['add']).not.toHaveBeenCalled();
  });

  it('should set rangoErroneo to true if fecha_inicio is after fecha_termino', async () => {
    component.nombre = 'Nombre';
    component.descripcion = 'Descripción';
    component.fecha_inicio = '2025-06-15';
    component.fecha_termino = '2025-06-10'; // Fecha inicio posterior

    await component.onSubmit();

    expect(component.rangoErroneo).toBeTrue();
    expect(component.loading).toBeFalse();
  });

  it('should call add method with valid data and close overlay on success', async () => {
    component.nombre = 'Nombre';
    component.descripcion = 'Descripción';
    component.fecha_inicio = '2025-06-10';
    component.fecha_termino = '2025-06-15';

    const mockAddFaseFlujo = jasmine.createSpy().and.returnValue(Promise.resolve(of({ message: 'Success' })));
    spyOn(component['httpRequestService'], 'addFaseFlujo').and.callFake(mockAddFaseFlujo);
    spyOn(component.close, 'emit');

    await component.onSubmit();

    expect(component.loading).toBeFalse();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should handle error when add fails', async () => {
    component.nombre = 'Nombre';
    component.descripcion = 'Descripción';
    component.fecha_inicio = '2025-06-10';
    component.fecha_termino = '2025-06-15';

    const mockAddFaseFlujo = jasmine.createSpy().and.returnValue(Promise.resolve(throwError(() => new Error('Fail'))));
    spyOn(component['httpRequestService'], 'addFaseFlujo').and.callFake(mockAddFaseFlujo);
    spyOn(component.close, 'emit');

    await component.onSubmit();

    expect(component.close.emit).toHaveBeenCalled(); // still closes
  });

});





