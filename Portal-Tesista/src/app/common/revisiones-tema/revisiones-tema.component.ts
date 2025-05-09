import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {HttpRequestService} from '../Http-request.service';

@Component({
  selector: 'app-revisiones-tema',
  templateUrl: './revisiones-tema.component.html',
  styleUrl: './revisiones-tema.component.scss'
})
export class RevisionesTemaComponent implements OnInit {
  loading = true;
  userRepresentation: any;

  temas: any[] = [];

  constructor(
    private userService: UserService,
    private httpRequestService: HttpRequestService
  ) {}

  async ngOnInit() {
    this.loading = true;
    try {
      this.userRepresentation = this.userService.getUser();
      await this.fetchTemas();
    } catch (error) {
      console.error('Error fetching user representation:', error);
    } finally {
      this.loading = false;
    }
  }

  async fetchTemas() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getTemasRevisionUsuario(this.userRepresentation.rut).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.temas = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching temas');
            reject(error);
          }
        );
      });
    });
  }

}
