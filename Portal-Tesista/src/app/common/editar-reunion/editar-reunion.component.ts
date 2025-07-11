import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {HttpRequestService} from '../Http-request.service';

@Component({
  selector: 'app-editar-reunion',
  templateUrl: './editar-reunion.component.html',
  styleUrl: './editar-reunion.component.scss'
})
export class EditarReunionComponent implements OnInit {
  @Input() userRepresentation: any;
  @Input() tema: any;
  @Input() reunion!: any;
  @Output() close = new EventEmitter<void>();

  fecha: any = '';
  completado = false;
  resumen = '';

  error: boolean = false;
  loading: boolean = false;
  constructor(
    private elementRef: ElementRef,
    private httpRequestService: HttpRequestService
  ) {}

ngOnInit() {
  if (this.reunion) {
    const date = new Date(this.reunion.fecha);
    this.fecha = date.toISOString().slice(0, 16); // Format as 'YYYY-MM-DDTHH:mm'
    this.completado = this.reunion.estado === 'completado';
    this.resumen = this.reunion.resumen;
  } else {
    this.error = true;
  }
}

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeOverlay();
    }
  }

  closeOverlay(){
    this.close.emit();
  }

  async eliminar() {
    try {
      await this.eliminarReunion();
    } catch (error) {
      console.error('Error al eliminar la reunión:', error);
      this.error = true;
    } finally {
      this.closeOverlay();
    }
  }

  async editar() {
    const date = new Date(this.fecha);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate()
      .toString()
      .padStart(2, '0')} ${date.getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes()
      .toString()
      .padStart(2, '0')}:${date.getSeconds()
      .toString()
      .padStart(2, '0')}`;

    const reunion = {
      id: this.reunion.id,
      fecha: formattedDate,
      resumen: this.resumen,
      estado: this.completado ? 'completado' : 'pendiente',
    };

    this.loading = true;
    try {
      await this.editarReunion(reunion);
    } catch (error) {
      console.error('Error al editar la reunión:', error);
      this.error = true;
    } finally {
      this.loading = false;
      this.closeOverlay();
    }
  }

  async editarReunion(reunion: { id: any; fecha: any; resumen: string; estado: string; }) {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.editarReunion(reunion).then(observable => {
        observable.subscribe(
          (data: any) => {
            resolve();
          },
          (error: any) => {
            console.error('Error al editar la reunión:', error);
            reject(error);
          }
        );
      });
    });
  }

  async eliminarReunion() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.eliminarReunion({id: this.reunion.id}).then(observable => {
        observable.subscribe(
          (data: any) => {
            resolve();
          },
          (error: any) => {
            console.error('Error al eliminar la reunión:', error);
            reject(error);
          }
        );
      });
    });
  }
}
