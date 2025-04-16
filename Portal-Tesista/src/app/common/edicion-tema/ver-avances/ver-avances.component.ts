import {Component, Input, OnInit} from '@angular/core';
import {HttpRequestService} from '../../Http-request.service';
import {FormControl} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';
import {forceAutocomplete} from '@angular/cli/src/utilities/environment-options';

export interface Profesor {
  nombre: string;
  rut: string;
  email: string;
}

@Component({
  selector: 'app-ver-avances',
  templateUrl: './ver-avances.component.html',
  styleUrl: './ver-avances.component.scss'
})
export class VerAvancesComponent implements OnInit{
  @Input() tema!: any;
  @Input() userRepresentation!: any;

  loading: boolean = false;
  esCargo: boolean = false;

  protected avances!: any;
  protected revisores!: any;
  protected profesores!: any;
  profesorSeleccionado: any;

  protected dataSource: Profesor[] = [];
  displayedColumns: string[] = ['nombre', 'email', 'Sacar'];

  constructor(
    private httpRequestService: HttpRequestService
  ){}

  async ngOnInit() {
    this.loading = true;
    try {
      await this.fetchAvances();
      await this.fetchProfesores();
      await this.fetchRevisores();
    } catch (e) {
      this.avances = null;
    } finally {
      this.loading = false;
    }
    this.esCargo = this.userRepresentation?.tipo === 'cargo';

  }


  async fetchAvances() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getAvancesTema(this.tema.id).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.avances = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching avances');
            reject(error);
          }
        );
      });
    });
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
            console.error('Error fetching profesores');
            reject(error);
          }
        );
      });
    });
  }

  async fetchRevisores() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getRevisoresTema(this.tema.id).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.revisores = data;
            const dataSource: Profesor[] = [];
            for (const data of this.revisores) {
              const profesor: Profesor = {
                nombre: data.nombre+' '+ data.apellido,
                rut: data.rut,
                email: data.correo
              };
              dataSource.push(profesor);
            }
            this.dataSource = dataSource;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching revisores');
            reject(error);
          }
        );
      });
    });
  }

  async borrarRevisor(revisor: any) {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.borrarRevisor(revisor).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.revisores = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching revisores');
            reject(error);
          }
        );
      });
    });
  }

  async addRevisor (revisor: any) {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.addRevisor(revisor).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.revisores = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching revisores');
            reject(error);
          }
        );
      });
    });
  }

  async deleteRevisor (revisor: any) {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.borrarRevisor(revisor).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.revisores = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching revisores');
            reject(error);
          }
        );
      });
    });
  }

  activarRevision(element: Profesor) {
    // logica de activado
  }

  async sacarRevisor(element: Profesor) {
    if (!element) {
      console.error('Elemento no seleccionado');
      return;
    }
    const revisor = {
      id_tema: this.tema.id,
      rut_revisor: element.rut,
    }
    this.loading = true;
    try {
      await this.deleteRevisor(revisor);
      await this.fetchRevisores();
    } catch (e) {
      console.error('Error al eliminar revisor');
    } finally {
      this.loading = false;
    }
  }

  async agregarRevisor() {
    if (!this.profesorSeleccionado) { // Agrega esta validación
      console.error('Ningún profesor seleccionado');
      return;
    }
    this.loading = true;
    try {
      const revisor = {
        id_tema: this.tema.id,
        rut_revisor: this.profesorSeleccionado.rut,
        rut_profesor_cargo: this.userRepresentation.rut
      }
      await this.addRevisor(revisor);
      await this.fetchRevisores();
    } catch (error) {
      console.error('Error al agregar revisor');
    } finally {
      this.loading = false;
    }
  }

descargarAvance(avance: any) {
  if (!avance || !avance.archivo) {
    console.error('No file available to download');
    return;
  }

  try {
    // Decode the Base64 string
    const byteCharacters = atob(avance.archivo); // `avance.archivo` should be a Base64 string
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the byte array
    const blob = new Blob([byteArray], { type: avance.tipoMime || 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = avance.nombre_archivo || 'archivo.pdf';
    a.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error decoding or downloading file:', error);
  }
}
}
