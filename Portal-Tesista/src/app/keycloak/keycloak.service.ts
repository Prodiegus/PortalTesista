import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../enviroments/enviroment';
import { UserProfile } from './user-profile';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private _keycloak: Keycloak | undefined;
  private _profile: UserProfile | undefined;

  constructor(private router: Router) { }

  get keycloak(): Keycloak {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      });
    }
    return this._keycloak;
  }

  get profile(): UserProfile | undefined {
    return this._profile;
  }

  async init() {
    const authenticated = await this.keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      redirectUri: window.location.origin + '/home',
    });

    if (authenticated) {
      this._profile = (await this.keycloak?.loadUserProfile()) as UserProfile;
      this._profile.token = this.keycloak?.token;
    }
  }

  isInitialized() {
    return !!this._keycloak;
  }

  isAuthenticated() {
    return this.keycloak?.authenticated;
  }

  login() {
    if (this.isAuthenticated()) {
      this.keycloak?.logout();
    }
    this.keycloak?.login();
  }

  logout(p: { redirectUri: string }) {
    return this.keycloak?.logout({
      redirectUri: window.location.origin,
    });
  }
}
