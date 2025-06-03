import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaProfesoresComponent } from './tabla-profesores.component';
import {Router} from '@angular/router';
import {CONST} from '../../../common/const/const';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TablaProfesoresComponent', () => {
  let component: TablaProfesoresComponent;
  let fixture: ComponentFixture<TablaProfesoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TablaProfesoresComponent],
      providers:  [
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => ({
              extras: {
                state: {
                  userRepresentation: CONST.userRepresentation,
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

    fixture = TestBed.createComponent(TablaProfesoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
