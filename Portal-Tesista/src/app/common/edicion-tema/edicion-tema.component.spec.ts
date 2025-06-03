import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionTemaComponent } from './edicion-tema.component';

import {CONST} from '../const/const';
import {Router} from '@angular/router';

import {CoGuiasComponent} from './co-guias/co-guias.component';
import {EditarDetalleComponent} from './editar-detalle/editar-detalle.component';
import {EditarFlujoComponent} from './editar-flujo/editar-flujo.component';
import {PanelDeEdicionTemaComponent} from './panel-de-edicion-tema/panel-de-edicion-tema.component';
import {VerAvancesComponent} from './ver-avances/ver-avances.component';
import {VerReunionesComponent} from './ver-reuniones/ver-reuniones.component';
import {FormsModule} from '@angular/forms';
import {HomeHeaderComponent} from '../home-header/home-header.component';
import {FooterComponent} from '../footer/footer.component';
import {MenuAdminComponent} from '../menu-admin/menu-admin.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('EdicionTemaComponent', () => {
  let component: EdicionTemaComponent;
  let fixture: ComponentFixture<EdicionTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EdicionTemaComponent,
        CoGuiasComponent,
        EditarDetalleComponent,
        EditarFlujoComponent,
        PanelDeEdicionTemaComponent,
        VerAvancesComponent,
        VerReunionesComponent,
        HomeHeaderComponent,
        FooterComponent,
        MenuAdminComponent
      ],
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

    fixture = TestBed.createComponent(EdicionTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
