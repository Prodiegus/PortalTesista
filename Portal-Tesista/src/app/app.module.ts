import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { KeycloakService } from './keycloak/keycloak.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterComponent } from './common/footer/footer.component';
import { LandingHeaderComponent } from './common/landing-header/landing-header.component';
import { LandingBodyComponent } from './landing/landing-body/landing-body.component';
import { TablaTemasComponent} from './landing/landing-body/tabla-temas/tabla-temas.component';
import { HomeHeaderComponent } from './common/home-header/home-header.component';
import { MenuAdminComponent } from './common/menu-admin/menu-admin.component';
import { ProfesoresComponent } from './home/profesores/profesores.component';
import { TablaProfesoresComponent } from './home/profesores/tabla-profesores/tabla-profesores.component';
import { AgregarDocenteComponent } from './common/agregar-docente/agregar-docente.component';
import { FlujoGeneralComponent } from './common/flujo-general/flujo-general.component';
import { DateFormatPipe } from './pipe/date-format.pipe';
import { AgregarFaseFlujoComponent } from './common/agregar-fase-flujo/agregar-fase-flujo.component';
import { DetalleFaseComponent } from './common/detalle-fase/detalle-fase.component';
import { TemasViewComponent } from './home/temas-view/temas-view.component';
import { AgregarTemaComponent } from './common/agregar-tema/agregar-tema.component';
import { TemaViewComponent } from './home/tema-view/tema-view.component';
import { TemaSummaryComponent } from './common/tema-summary/tema-summary.component';
import { CalendarioTemaComponent } from './common/calendario-tema/calendario-tema.component';
import { EdicionTemaComponent } from './common/edicion-tema/edicion-tema.component';
import { PanelDeEdicionTemaComponent } from './common/edicion-tema/panel-de-edicion-tema/panel-de-edicion-tema.component';
import { DetalleComponent } from './common/edicio-tema/panel-de-edicion-tema/detalle/detalle.component';
import { EditarDetalleComponent } from './common/edicion-tema/editar-detalle/editar-detalle.component';
import { EditarFlujoComponent } from './common/edicion-tema/editar-flujo/editar-flujo.component';
import { VerAvancesComponent } from './common/edicion-tema/ver-avances/ver-avances.component';
import { VerReunionesComponent } from './common/edicion-tema/ver-reuniones/ver-reuniones.component';
import { EditarDuenosComponent } from './common/edicion-tema/editar-duenos/editar-duenos.component';
import { TemaPopupComponent } from './landing/landing-body/tema-popup/tema-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LandingComponent,
    FooterComponent,
    LandingHeaderComponent,
    LandingBodyComponent,
    TablaTemasComponent,
    HomeHeaderComponent,
    MenuAdminComponent,
    ProfesoresComponent,
    TablaProfesoresComponent,
    AgregarDocenteComponent,
    FlujoGeneralComponent,
    DateFormatPipe,
    AgregarFaseFlujoComponent,
    DetalleFaseComponent,
    TemasViewComponent,
    AgregarTemaComponent,
    TemaViewComponent,
    TemaSummaryComponent,
    CalendarioTemaComponent,
    EdicionTemaComponent,
    PanelDeEdicionTemaComponent,
    DetalleComponent,
    EditarDetalleComponent,
    EditarFlujoComponent,
    VerAvancesComponent,
    VerReunionesComponent,
    EditarDuenosComponent,
    TemaPopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [KeycloakService, Router],
      useFactory: (keycloakService: KeycloakService, router: Router) => () => {
        const publicRoutes = [''];
        if (publicRoutes.includes(router.url)) {
          return keycloakService.init();
        }
        return Promise.resolve();
      },
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
