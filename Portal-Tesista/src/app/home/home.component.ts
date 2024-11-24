import { Component, OnInit } from '@angular/core';
import { KeycloakService } from '../keycloak/keycloak.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../enviroments/enviroment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  protected role: string = '';
  private apiLogin = environment.apiLogin.url;

  constructor(private keycloakService: KeycloakService, private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchRole();
  }

  async logout() {
    await this.keycloakService.logout({ redirectUri: window.location.origin });
  }

  async fetchRole() {
    const token = this.keycloakService.keycloak.token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<{ role: string }>(this.apiLogin + '/roles', { headers })
      .subscribe(
        response => {
          if (response && response.role) {
            this.role = response.role;
          } else {
            this.role = 'Unexpected response format';
          }
        },
        error => {
          this.role = 'Error al obtener roles';
        }
      );
  }
}
