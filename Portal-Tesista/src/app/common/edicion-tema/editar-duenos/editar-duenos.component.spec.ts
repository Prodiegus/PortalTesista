import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDuenosComponent } from './editar-duenos.component';
import {CONST} from '../../const/const';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('EditarDuenosComponent', () => {
  let component: EditarDuenosComponent;
  let fixture: ComponentFixture<EditarDuenosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarDuenosComponent],
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

    fixture = TestBed.createComponent(EditarDuenosComponent);
    component = fixture.componentInstance;

    component.userRepresentation = CONST.userRepresentation;
    component.tema = CONST.temas[0];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
