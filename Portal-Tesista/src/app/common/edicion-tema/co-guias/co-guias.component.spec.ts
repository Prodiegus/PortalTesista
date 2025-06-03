import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoGuiasComponent } from './co-guias.component';
import {Router} from '@angular/router';
import {CONST} from '../../const/const';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('CoGuiasComponent', () => {
  let component: CoGuiasComponent;
  let fixture: ComponentFixture<CoGuiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoGuiasComponent],
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


    fixture = TestBed.createComponent(CoGuiasComponent);
    component = fixture.componentInstance;

    component.userRepresentation = CONST.userRepresentation;
    component.tema = CONST.temas[0];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
