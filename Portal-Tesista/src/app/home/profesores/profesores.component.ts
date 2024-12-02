import { Component } from '@angular/core';
import { UserService } from '../../common/user.service';
import { HttpRequestService } from '../../common/Http-request.service';

@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrl: './profesores.component.scss'
})
export class ProfesoresComponent {
  protected userRepresentation: any;
  protected profesores: any;

  loading = true;

  constructor(
    private userService: UserService,
    private httpRequestService: HttpRequestService
  ) { }

  async ngOnInit() {
    this.userRepresentation = this.userService.getUser();
    await this.fetchProfesores();
    this.loading = false;
  }

  async fetchProfesores() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getProfesores(this.userRepresentation.escuela).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.profesores = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching profesores: ', error);
            reject(error);
          }
        );
      });
    });
  }
}
