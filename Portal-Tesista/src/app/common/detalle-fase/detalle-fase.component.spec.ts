import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFaseComponent } from './detalle-fase.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CONST} from '../const/const';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

describe('DetalleFaseComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: DetalleFaseComponent;
  let fixture: ComponentFixture<DetalleFaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleFaseComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => ({
              extras: {
                state: {
                  userRepresentation: CONST.userRepresentation,
                  fase: CONST.fases[0],
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

    fixture = TestBed.createComponent(DetalleFaseComponent);
    component = fixture.componentInstance;

    component.userRepresentation = CONST.userRepresentation;
    component.fase = CONST.fases[0];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

