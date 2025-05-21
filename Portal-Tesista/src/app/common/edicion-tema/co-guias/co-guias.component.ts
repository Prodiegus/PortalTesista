import {Component, Input, OnInit} from '@angular/core';
import {HttpRequestService} from '../../Http-request.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-co-guias',
  templateUrl: './co-guias.component.html',
  styleUrl: './co-guias.component.scss'
})
export class CoGuiasComponent implements OnInit{
  @Input() userRepresentation!: any;
  @Input() tema!: any;

  loading: boolean = true;
  esGuia: boolean = false;
  agregarprofesorPopup = false;

  profesores: any[] = [];
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  nuevoprofesor: any;
  profesoreseleccionado: any;

  constructor(
    private httpsRequestService: HttpRequestService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.loading = true;
    try {
      this.esGuia = this.userRepresentation.rut === this.tema.rut_guia;
      await this.getprofesores();
      await this.getAllUsuarios();
    } catch (error) {
      console.error('Error fetching profesores:', error);
    } finally {
      this.loading = false;
    }
  }

  rutEsprofesor(rut: string) {
    return this.profesores.some(profesor => profesor.rut === rut);
  }

  async getprofesores() {
    return new Promise<void>((resolve, reject) => {
      this.httpsRequestService.getCoguia(this.tema.id).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.profesores = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching profesores');
            reject(error);
          }
        );
      });
    });
  }

  async getAllUsuarios() {
    return new Promise<void>((resolve, reject) => {
      this.httpsRequestService.getProfesores(this.tema.nombre_escuela).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.usuarios = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching usuarios');
            reject(error);
          }
        );
      });
    });
  }

  async agregarprofesor() {
    if (!this.profesoreseleccionado) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Agregar Co-Guía',
          message: 'Debes seleccionar un profesor antes de agregarlo.',
          isAlert: true
        }
      });
      return;
    }
    if (this.rutEsprofesor(this.profesoreseleccionado.rut)) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Agregar Co-Guía',
          message: 'El usuario ya es Co-Guía del tema.',
          isAlert: true
        }
      });
      return;
    }
    if(!this.esGuia){
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Agregar Co-Guía',
          message: 'No puedes agregar un Co-Guía si no guías el tema.',
          isAlert: true
        }
      });
      return;
    }

    const profesor = {
      rut: this.profesoreseleccionado.rut,
      id_tema: this.tema.id
    };
    try {
      await this.addprofesor(profesor);
    } catch (error) {
      console.error('Error adding profesor:', error);
    } finally {
      this.agregarprofesorPopup = false;
      this.nuevoprofesor = null;
      this.profesoreseleccionado = null;
      await this.getprofesores();
    }
  }

  async addprofesor(profesor: any) {
    return new Promise<void>((resolve, reject) => {
      this.httpsRequestService.addCoguia(profesor).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.getprofesores();
            resolve();
          },
          (error: any) => {
            console.error('Error adding profesor');
            reject(error);
          }
        );
      });
    });
  }

  confirmarEliminarprofesor(profesor: any) {
    if (!this.esGuia) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Eliminar Co-Guía',
          message: 'No puedes eliminar a un Co-Guía si no guías el tema.',
          isAlert: true
        }
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Co-Guía',
        message: '¿Estás seguro de que deseas eliminar a '+profesor.nombre+' '+profesor.apellido+' de la lista de Co-Guías?',
        isAlert: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.quitarprofesor(profesor.rut);
      }
    });
  }

  async quitarprofesor(rut: any) {
    const json = {
      rut: rut,
      id_tema: this.tema.id
    }
    try {
      await this.eliminarprofesor(json);
    } catch (error) {
      console.error('Error deleting profesor:', error);
    } finally {
      await this.getprofesores();
    }
  }

  async eliminarprofesor(profesor: any) {
    return new Promise<void>((resolve, reject) => {
      this.httpsRequestService.borrarCoguia(profesor).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.getprofesores();
            resolve();
          },
          (error: any) => {
            console.error('Error deleting profesor');
            reject(error);
          }
        );
      });
    });
  }

  filtrarUsuarios() {
    if (!this.nuevoprofesor) {
      this.usuariosFiltrados = [];
      return;
    }
    const texto = this.nuevoprofesor?.toLowerCase() || '';
    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(texto) ||
      usuario.correo.toLowerCase().includes(texto)
    );
  }

  seleccionarUsuario(usuario: any) {
    this.nuevoprofesor = usuario.nombre + ' ' + usuario.apellido;
    this.profesoreseleccionado = usuario;
    this.usuariosFiltrados = []; // Limpia la lista después de seleccionar
  }

}
