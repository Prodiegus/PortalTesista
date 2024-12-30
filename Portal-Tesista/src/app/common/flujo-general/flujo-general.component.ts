import { Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {HttpRequestService} from '../Http-request.service';

@Component({
  selector: 'app-flujo-general',
  templateUrl: './flujo-general.component.html',
  styleUrl: './flujo-general.component.scss'
})
export class FlujoGeneralComponent {
  loading = true;
  userRepresentation: any;
  flujoGeneral: any;

  constructor(
    private userService: UserService,
    private httpRequestService: HttpRequestService,

  ) {}

  async ngOnInit(){
    await this.fetchFlujoGeneral();
    this.userRepresentation = this.userService.getUser();
    this.loading = false;
  }

  async fetchFlujoGeneral(){
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getFlujosGenerales().then(observable => {
        observable.subscribe(
          (data: any) => {
            this.flujoGeneral = data;
            console.log('Flujo general:', data);
            resolve();
          },
          (error: any) => {
            console.error('Error fetching flujo general: ', error);
            reject(error);
          }
        );
      });
    });
  }
}
