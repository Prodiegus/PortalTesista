import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LandingComponent} from './landing/landing.component';
import {authGuard} from './guard/auth.guard';
import { ProfesoresComponent } from './home/profesores/profesores.component';
import { FlujoGeneralComponent } from './common/flujo-general/flujo-general.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'home/profesores', component: ProfesoresComponent, canActivate: [authGuard] },
  { path: 'home/flujo-general', component: FlujoGeneralComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
