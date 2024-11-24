import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { KeycloakService } from './keycloak/keycloak.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LandingComponent,
    LoginComponent
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
        const publicRoutes = ['', 'login'];
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
