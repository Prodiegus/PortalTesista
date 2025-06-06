import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioSolicitudTemaComponent } from './formulario-solicitud-tema.component';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DateFormatPipe} from '../../../pipe/date-format.pipe';
import {CONST} from '../../../common/const/const';

describe('FormularioSolicitudTemaComponent', () => {
  let component: FormularioSolicitudTemaComponent;
  let fixture: ComponentFixture<FormularioSolicitudTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FormularioSolicitudTemaComponent,
        DateFormatPipe
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioSolicitudTemaComponent);
    component = fixture.componentInstance;

    component.tema = CONST.temas[0];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
