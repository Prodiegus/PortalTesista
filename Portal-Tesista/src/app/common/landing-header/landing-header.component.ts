import { Component } from '@angular/core';
import {KeycloakService} from '../../keycloak/keycloak.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing-header',
  templateUrl: './landing-header.component.html',
  styleUrl: './landing-header.component.scss'
})
export class LandingHeaderComponent {
  constructor(private keycloakService: KeycloakService) {
  }

  loading: boolean = false;

  async goHome() {
    this.loading = true;
    await this.keycloakService.init();
    await this.keycloakService.login();
    this.loading = false;
  }
}
