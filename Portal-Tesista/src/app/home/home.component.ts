import { Component, OnInit } from '@angular/core';
import { KeycloakService } from '../keycloak/keycloak.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  protected saludo: string = '';
  protected saludoAlumno: string = ' ';
  protected saludoProfesor: string = ' ';
  protected saludoCargo: string = ' ';

  constructor(private keycloakService: KeycloakService, private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchSaludo();
    this.fetchSaludoAlumno();
    this.fetchSaludoProfesor();
    this.fetchSaludoCargo();
  }

  async logout() {
    await this.keycloakService.logout({ redirectUri: window.location.origin });
  }

  async fetchSaludo() {
    const token = this.keycloakService.keycloak.token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<{ saludo: string }>('http://localhost:9090/', { headers })
      .subscribe(
        response => {
          if (response) {
            this.saludo = response.saludo;
          } else {
            this.saludo = 'Unexpected response format';
          }
        },
        error => {
          this.saludo = 'Error: \n' + error.message;
        }
      );
  }

  async fetchSaludoAlumno() {
    const token = this.keycloakService.keycloak.token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<{ saludo: string }>('http://localhost:9090/alumno', { headers })
      .subscribe(
        response => {
          if (response) {
            this.saludoAlumno = response.saludo;
          } else {
            this.saludoAlumno = 'No se tiene rol alumno';
          }
        },
        error => {
          this.saludoAlumno = 'Error: \n' + error.message;
        }
      );
  }
  async fetchSaludoProfesor() {
    const token = this.keycloakService.keycloak.token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<{ saludo: string }>('http://localhost:9090/profesor', { headers })
      .subscribe(
        response => {
          if (response) {
            this.saludoProfesor = response.saludo;
          } else {
            this.saludoProfesor = 'No se tiene rol profesor';
          }
        },
        error => {
          this.saludoProfesor = 'Error: \n' + error.message;
        }
      );
  }
  async fetchSaludoCargo() {
    const token = this.keycloakService.keycloak.token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<{ saludo: string }>('http://localhost:9090/cargo', { headers })
      .subscribe(
        response => {
          if (response) {
            this.saludoCargo = response.saludo;
          } else {
            this.saludoCargo = 'No se tiene rol cargo';
          }
        },
        error => {
          this.saludoCargo = 'Error: \n' + error.message;
        }
      );
  }
}
