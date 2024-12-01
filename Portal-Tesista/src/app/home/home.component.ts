import { Component, OnInit } from '@angular/core';
import { KeycloakService } from '../keycloak/keycloak.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpRequestService } from '../common/Http-request.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  protected userRepresentation: any;
  protected loading = true;

  constructor(
    private keycloakService: KeycloakService,
    private http: HttpClient,
    private httpRequestService: HttpRequestService
  ) { }

  async ngOnInit() {
    this.loading = true;
    await this.initializeData();
    this.loading = false;
  }

  async logout() {
    await this.keycloakService.logout({ redirectUri: window.location.origin });
  }

  private async initializeData() {
    const token = this.keycloakService.keycloak.token;
    await Promise.all([
      this.fetchUserRepresentation(token),
    ]);
  }

  private async fetchUserRepresentation(token: string | undefined) {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getUserData(token).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.userRepresentation = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching user data: ', error);
            reject(error);
          }
        );
      });
    });
  }
}
