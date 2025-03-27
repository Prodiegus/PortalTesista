import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {HttpRequestService} from '../Http-request.service';

@Component({
  selector: 'app-detalle-solicitud',
  templateUrl: './detalle-solicitud.component.html',
  styleUrl: './detalle-solicitud.component.scss'
})
export class DetalleSolicitudComponent {
  @Input() solicitud: any;
  @Input() tema: any;
  @Input() userRepresentation: any;

  @Output() close = new EventEmitter<void>();

  loading: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private httpRequestService: HttpRequestService,
  ) { }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeOverlay();
    }
  }

  closeOverlay() {
    this.close.emit();
  }

  async aceptarSolicitud(){
    this.loading = true;
    try {
      await this.updateSolicitud();
    } catch (error) {
      console.error('Error aceptando solicitud');
    } finally {
      this.loading = false;
      this.closeOverlay();
    }
  };

  private async updateSolicitud() {
    const solicitud = {
      topic_id: this.tema.id,
      rut_alumno: this.solicitud.rut,
    }
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.aceptarTema(solicitud).then(observable => {
        observable.subscribe(
          (data: any) => {
            resolve();
          },
          (error: any) => {
            console.error('Error aceptando solicitud');
            reject(error);
          }
        );
      });
    });
  }
}
