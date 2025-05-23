import {Component, Input, OnInit} from '@angular/core';
import {HttpRequestService} from '../../Http-request.service';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-editar-duenos',
  templateUrl: './editar-duenos.component.html',
  styleUrl: './editar-duenos.component.scss'
})
export class EditarDuenosComponent implements OnInit{
  @Input() userRepresentation: any;
  @Input() tema: any;

  loading = false;
  agregarDuenoPopup = false;

  duenos: any[] = [];
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  nuevoDueno: any;
  duenoSeleccionado: any;

  constructor(
    private httpsRequestService: HttpRequestService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.loading = true;
    try {
      await this.getDuenos();
      await this.getAllUsuarios();
    } catch (error) {
      console.error('Error fetching duenos:', error);
    } finally {
      this.loading = false;
    }
  }

  rutEsDueno(rut: string) {
    return this.duenos.some(dueno => dueno.rut === rut);
  }

  async getDuenos() {
    return new Promise<void>((resolve, reject) => {
      this.httpsRequestService.getDuenoTema(this.tema.id).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.duenos = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching duenos');
            reject(error);
          }
        );
      });
    });
  }

  async getAllUsuarios() {
    return new Promise<void>((resolve, reject) => {
      this.httpsRequestService.getUsuarios().then(observable => {
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

  async agregarDueno() {
    if (!this.duenoSeleccionado) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Agregar dueño',
          message: 'Debes seleccionar un dueño antes de agregarlo.',
          isAlert: true
        }
      });
      return;
    }
    if (this.rutEsDueno(this.duenoSeleccionado.rut)) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Agregar dueño',
          message: 'El usuario ya es dueño del tema.',
          isAlert: true
        }
      });
      return;
    }
    if(!this.rutEsDueno(this.userRepresentation.rut)){
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Agregar dueño',
          message: 'No puedes agregar un dueño si no eres dueño del tema.',
          isAlert: true
        }
      });
      return;
    }
    const dueno = {
      rut: this.duenoSeleccionado.rut,
      id_tema: this.tema.id
    };
    try {
      await this.addDueno(dueno);
    } catch (error) {
      console.error('Error adding dueno:', error);
    } finally {
      this.agregarDuenoPopup = false;
      this.nuevoDueno = null;
      this.duenoSeleccionado = null;
      await this.getDuenos();
    }
  }

  async addDueno(dueno: any) {
    return new Promise<void>((resolve, reject) => {
      this.httpsRequestService.addDuenoTema(dueno).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.getDuenos();
            resolve();
          },
          (error: any) => {
            console.error('Error adding dueno');
            reject(error);
          }
        );
      });
    });
  }

  confirmarEliminarDueno(dueno: any) {
    if (!this.rutEsDueno(this.userRepresentation.rut)){
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Eliminar dueño',
          message: 'No puedes eliminar a un dueño si no eres dueño del tema.',
          isAlert: true
        }
      });
      return;
    }

    if (this.duenos.length < 2) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Eliminar dueño',
          message: 'No puedes eliminar al último dueño del tema.',
          isAlert: true
        }
      });
      return;
    }


    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar dueño',
        message: '¿Estás seguro de que deseas eliminar a '+dueno.nombre+' '+dueno.apellido+' de la lista de dueños?',
        isAlert: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.quitarDueno(dueno.rut);
      }
    });
  }

  async quitarDueno(rut: any) {
    const json = {
      rut: rut,
      id_tema: this.tema.id
    }
    try {
      await this.eliminarDueno(json);
    } catch (error) {
      console.error('Error deleting dueno:', error);
    } finally {
      await this.getDuenos();
    }
  }

  async eliminarDueno(dueno: any) {
    return new Promise<void>((resolve, reject) => {
      this.httpsRequestService.borrarDuenoTema(dueno).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.getDuenos();
            resolve();
          },
          (error: any) => {
            console.error('Error deleting dueno');
            reject(error);
          }
        );
      });
    });
  }

  filtrarUsuarios() {
    if (!this.nuevoDueno) {
      this.usuariosFiltrados = [];
      return;
    }
    const texto = this.nuevoDueno?.toLowerCase() || '';
    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(texto) ||
      usuario.correo.toLowerCase().includes(texto)
    );
  }

  seleccionarUsuario(usuario: any) {
    this.nuevoDueno = usuario.nombre + ' ' + usuario.apellido;
    this.duenoSeleccionado = usuario;
    this.usuariosFiltrados = []; // Limpia la lista después de seleccionar
  }

}
