import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarDocenteComponent } from './agregar-docente.component';
import {Router} from '@angular/router';
import {CONST} from '../const/const';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AgregarDocenteComponent', () => {
  let component: AgregarDocenteComponent;
  let fixture: ComponentFixture<AgregarDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarDocenteComponent],
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

    fixture = TestBed.createComponent(AgregarDocenteComponent);
    component = fixture.componentInstance;

    component.userRepresentation = CONST.userRepresentation;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
