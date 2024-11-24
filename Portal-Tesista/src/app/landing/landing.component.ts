import { Component } from '@angular/core';
import {KeycloakService} from '../keycloak/keycloak.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

  constructor(private keycloakService: KeycloakService, private router: Router) {
  }

  async goHome() {
    await this.keycloakService.init();
    await this.keycloakService.login();
  }
}
