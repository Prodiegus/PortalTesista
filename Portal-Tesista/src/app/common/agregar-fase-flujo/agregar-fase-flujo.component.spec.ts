import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarFaseFlujoComponent } from './agregar-fase-flujo.component';
import {Router} from '@angular/router';
import {CONST} from '../const/const';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AgregarFaseFlujoComponent', () => {
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

  xit('should return if form data is empty', () => {
    component.nombre = '';
    component.descripcion = '';
    component.fecha_inicio = '';
    component.fecha_termino = '';

    const result = component.onSubmit();
    expect(result).toBeFalse(); 
  });
});
