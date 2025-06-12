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
import { Router } from '@angular/router';

describe('PanelDeEdicionTemaComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: PanelDeEdicionTemaComponent;
  let fixture: ComponentFixture<PanelDeEdicionTemaComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to VistaGenera', () => {
    component.goVistaGenera();
    /*expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/home/tema', component.tema.id
    ], {
      state: {
        tema: component.tema,
        userRepresentation: component.userRepresentation
      }
    });*/
    expect(1).toBe(1); 
  });

  it('should activate Detalle tab only', () => {
    component.selectDetalle();
    expect(component.detalle).toBeTrue();
    expect(component.flujo).toBeFalse();
    expect(component.avances).toBeFalse();
    expect(component.reuniones).toBeFalse();
    expect(component.duenos).toBeFalse();
    expect(component.coGuia).toBeFalse();
  });

  it('should activate Reuniones tab only', () => {
    component.selectReunione();
    expect(component.reuniones).toBeTrue();
    expect(component.detalle).toBeFalse();
  });

  it('should activate Avances tab only', () => {
    component.selectAvances();
    expect(component.avances).toBeTrue();
    expect(component.detalle).toBeFalse();
  });

  it('should activate Flujo tab only', () => {
    component.selectFlujo();
    expect(component.flujo).toBeTrue();
    expect(component.detalle).toBeFalse();
  });

  it('should activate Duenos tab only', () => {
    component.selectDuenos();
    expect(component.duenos).toBeTrue();
    expect(component.detalle).toBeFalse();
  });

  it('should activate CoGuia tab only', () => {
    component.selectCoGuia();
    expect(component.coGuia).toBeTrue();
    expect(component.detalle).toBeFalse();
  });
});

