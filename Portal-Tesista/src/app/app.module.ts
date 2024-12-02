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
