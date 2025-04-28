import {Component, Input, OnInit} from '@angular/core';
import {HttpRequestService} from '../../Http-request.service';

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

  constructor(
    private httpsRequestService: HttpRequestService
  ) {}

  async ngOnInit() {
    this.loading = true;
    try {
      await this.getDuenos();
    } catch (error) {
      console.error('Error fetching duenos:', error);
    } finally {
      this.loading = false;
    }
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

  agregarDueno() {
    this.agregarDuenoPopup = true;
  }

  cerrarAgregarDueno() {
    this.agregarDuenoPopup = false;
  }

  async quitarDueno(rut: any) {
    if (this.duenos.length < 2) {
      alert('No se puede eliminar el último dueño');
      return;
    }
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

}
