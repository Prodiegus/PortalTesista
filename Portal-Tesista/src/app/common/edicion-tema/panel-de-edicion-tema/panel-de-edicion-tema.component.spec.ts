import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelDeEdicionTemaComponent } from './panel-de-edicion-tema.component';
import {EditarFlujoComponent} from '../editar-flujo/editar-flujo.component';
import {CoGuiasComponent} from '../co-guias/co-guias.component';
import {EditarDetalleComponent} from '../editar-detalle/editar-detalle.component';
import {VerAvancesComponent} from '../ver-avances/ver-avances.component';
import {VerReunionesComponent} from '../ver-reuniones/ver-reuniones.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CONST} from '../../const/const';
import {FormsModule} from '@angular/forms';

describe('PanelDeEdicionTemaComponent', () => {
  let component: PanelDeEdicionTemaComponent;
  let fixture: ComponentFixture<PanelDeEdicionTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PanelDeEdicionTemaComponent,
        EditarFlujoComponent,
        CoGuiasComponent,
        EditarDetalleComponent,
        VerAvancesComponent,
        VerReunionesComponent
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelDeEdicionTemaComponent);
    component = fixture.componentInstance;

    component.userRepresentation = CONST.userRepresentation;
    component.tema = CONST.temas[0];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
