import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private  _keycloak: Keycloak | undefined;

  constructor(private http: HttpClient) { }

  get keycloak(): Keycloak {
    if (!this._keycloak) {
      this._keycloak = new Keycloak(
        {
          url: 'https://34.176.220.92:8443/',
          realm: 'portal-tesista',
          clientId: 'api-login'
        }
      );
    }
    return this._keycloak;
  }

  async init() {
    console.log('KeycloakService initializing...');
    const authenticated = await this.keycloak.init({
      onLoad: 'login-required',
    });
    console.log('KeycloakService initialized: ', authenticated ? 'authenticated' : 'not authenticated');

  }
}

