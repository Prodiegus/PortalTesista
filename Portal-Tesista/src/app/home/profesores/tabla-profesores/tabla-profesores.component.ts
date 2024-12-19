import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { UserService } from '../../../common/user.service';
import { HttpRequestService } from '../../../common/Http-request.service';

@Component({
  selector: 'app-tabla-profesores',
  templateUrl: './tabla-profesores.component.html',
  styleUrls: ['./tabla-profesores.component.scss']
})
export class TablaProfesoresComponent {
  @Input() userRepresentation: any;

  protected profesores: any;
  
  showAgregarDocente: boolean = false;
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

  verProfe(profesor: any) {
    console.log(profesor);
  }

  desactivar(profesor: any) {
    console.log(profesor);
  }

  activar(profesor: any) {
    console.log(profesor);
  }

  agregarProfesor() {
    this.showAgregarDocente = true;
  }

  async closeAgregarDocente() {
    this.showAgregarDocente = false;
    this.loading = true;
    await this.fetchProfesores();
    this.loading = false;
  }
}
