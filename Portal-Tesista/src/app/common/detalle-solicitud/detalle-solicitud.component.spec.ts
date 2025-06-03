import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSolicitudComponent } from './detalle-solicitud.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CONST} from '../const/const';

describe('DetalleSolicitudComponent', () => {
  let component: DetalleSolicitudComponent;
  let fixture: ComponentFixture<DetalleSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleSolicitudComponent],
      imports: [
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleSolicitudComponent);
    component = fixture.componentInstance;

    component.userRepresentation = CONST.userRepresentation;
    component.tema = CONST.temas[0];
    component.solicitud = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
