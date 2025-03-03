import {Component, Input} from '@angular/core';
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
  protected loading = true;

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

  async desactivar(profesor: any) {
    this.loading = true;
    const body = {
      id: profesor.id,
      rut: profesor.rut
    };

    try {
      const observable = await this.httpRequestService.desactivarDocente(body);
      observable.subscribe(
        async (data: any) => {
          if (data && data.estado === "Usuario desactivado") {
            console.log('Profesor desactivado:', data);
            await this.fetchProfesores();
            this.loading = false;
          } else {
            console.error('Error desactivando profesor: ', data);
          }
        },
        (error: any) => {
          console.error('Error desactivando profesor:', error);
        }
      );
    } catch (error) {
      console.error('Error en la solicitud de desactivación:', error);
    }

  }

  async activar(profesor: any) {
    this.loading = true;
    const nombre_split = profesor.nombre.split(" ");
    const nombre = nombre_split[0];
    const apellido = nombre_split[1];
    const body = {
      nombre: nombre,
      apellido: apellido,
      rut: profesor.rut,
      correo: profesor.correo,
      tipo: profesor.tipo,
    };

    try {
      const observable = await this.httpRequestService.activarDocente(body);
      observable.subscribe(
        async (data: any) => {
          if (data && data.estado === "Usuario activado") {
            console.log('Profesor activado:', data);
            await this.fetchProfesores();
            this.loading = false;
          } else {
            console.error('Error activando profesor: ', data);
          }
        },
        (error: any) => {
          console.error('Error activando profesor:', error);
        }
      );
    } catch (error) {
      console.error('Error en la solicitud de activación:', error);
    }

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
