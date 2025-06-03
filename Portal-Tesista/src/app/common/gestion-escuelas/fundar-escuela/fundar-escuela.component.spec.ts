import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundarEscuelaComponent } from './fundar-escuela.component';
import {Router} from '@angular/router';
import {CONST} from '../../const/const';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('FundarEscuelaComponent', () => {
  let component: FundarEscuelaComponent;
  let fixture: ComponentFixture<FundarEscuelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundarEscuelaComponent],
      providers:  [
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => ({
              extras: {
                state: {
                  userRepresentation: CONST.userRepresentation,
                  escuelas: CONST.escuelas
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

    fixture = TestBed.createComponent(FundarEscuelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
