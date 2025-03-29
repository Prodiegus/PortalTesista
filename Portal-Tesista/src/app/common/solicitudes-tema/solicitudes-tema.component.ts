import {Component, Input, OnInit} from '@angular/core';
import {HttpRequestService} from '../Http-request.service';

@Component({
  selector: 'app-solicitudes-tema',
  templateUrl: './solicitudes-tema.component.html',
  styleUrl: './solicitudes-tema.component.scss'
})
export class SolicitudesTemaComponent implements OnInit{
  @Input() tema: any;
  @Input() userRepresentation: any;

  loading = true;
  solicitudes: any[] = [];

  detalleSolicitud = false;
  solicitudSeleccionada: any;

  constructor(
    private httpRequestService: HttpRequestService
  ) {}

  async ngOnInit() {
    try {
      await this.fetchSolicitudes();
    } catch (error) {
      console.error('Error fetching solicitudes');
    } finally {
      this.loading = false;
    }
  }

  async fetchSolicitudes() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getSolicitudes(this.tema.id).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.solicitudes = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching solicitudes');
            reject(error);
          }
        )
      });
    });
  }

  mostrarDetalleSolicitud(solicitud: any) {
    this.solicitudSeleccionada = solicitud;
    this.detalleSolicitud = true;
  }

  closeDetalleSolicitud() {
    this.detalleSolicitud = false;
  }
}
