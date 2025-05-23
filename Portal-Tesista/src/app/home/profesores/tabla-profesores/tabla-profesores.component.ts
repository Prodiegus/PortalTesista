import {Component, Input} from '@angular/core';
import { UserService } from '../../../common/user.service';
import { HttpRequestService } from '../../../common/Http-request.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../common/confirm-dialog/confirm-dialog.component';

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
    private httpRequestService: HttpRequestService,
    private Dialog: MatDialog
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
            this.profesores.forEach((profesor: any) => {
              profesor.cambiarRol = false;
            });
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
    const dialogRef = this.Dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Desactivar profesor',
        message: `¿Está seguro de que desea desactivar a ${profesor.nombre}? Este no podrá acceder a la plataforma hasta que sea reactivado.`,
        isAlert: false,
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
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
    });
  }

  async activar(profesor: any) {
    const dialogRef = this.Dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Activar profesor',
        message: `¿Está seguro de que desea activar a ${profesor.nombre}? Este podrá volver a acceder luego de esta acción.`,
        isAlert: false,
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
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
    });
  }

  agregarProfesor() {
    this.showAgregarDocente = true;
  }

  toogleCambiarRol(profesor: any) {
    profesor.cambiarRol = !profesor.cambiarRol;
  }

  async cambiarRol(profesor: any) {
    const body ={
      nombre: profesor.nombre.split(" ")[0],
      apellido: profesor.nombre.split(" ")[1],
      rut: profesor.rut,
      correo: profesor.correo,
      tipo: profesor.tipo === 'cargo' ? 'guia' : 'cargo',
      escuela: profesor.escuela,
      activo: profesor.activo
    };
    try {
      const dialogRef = this.Dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Cambiar rol',
          message: `¿Está seguro de que desea cambiar el rol de ${profesor.nombre}?`,
          isAlert: false,
          confirmButtonText: 'Sí',
        }
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          this.loading = true;
          await this.actualizarUsuario(body);
          await this.fetchProfesores();
          this.loading = false;
        }
      });

    } catch (error) {
      console.error('Error cambiando rol:', error);
    }
  }

  async actualizarUsuario(profesor: any) {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.editarUsuario(profesor).then(observable => {
        observable.subscribe(
          (data: any) => {
            resolve(data);
          },
          (error: any) => {
            console.error('Error actualizando profesor:', error);
            reject(error);
          }
        );
      });
    });
  }

  async closeAgregarDocente() {
    this.showAgregarDocente = false;
    this.loading = true;
    await this.fetchProfesores();
    this.loading = false;
  }
}
