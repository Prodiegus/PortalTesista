import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionesTemaComponent } from './revisiones-tema.component';
import {Router} from '@angular/router';
import {CONST} from '../const/const';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('RevisionesTemaComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: RevisionesTemaComponent;
  let fixture: ComponentFixture<RevisionesTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevisionesTemaComponent],
      providers:  [
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => ({
              extras: {
                state: {
                  userRepresentation: CONST.userRepresentation,
                  temas: CONST.temas,
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

    fixture = TestBed.createComponent(RevisionesTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

