import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class KeycloakAuthService {
  private tokenEndpoint = `${environment.keycloak.url}/realms/${environment.keycloak.realm}/protocol/openid-connect/token`;

  constructor(private http: HttpClient) {}

  authenticateClient() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new HttpParams()
      .set('client_id', environment.keycloak.clientId)
      .set('grant_type', 'client_credentials');

    return this.http.post(this.tokenEndpoint, body.toString(), { headers });
  }
}
