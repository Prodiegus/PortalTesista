import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {HttpRequestService} from '../Http-request.service';

@Component({
  selector: 'app-agregar-fase-flujo',
  templateUrl: './agregar-fase-flujo.component.html',
  styleUrl: './agregar-fase-flujo.component.scss'
})
export class AgregarFaseFlujoComponent {
  @Input() userRepresentation!: any;
  @Input() id_flujo!: number;
  @Input() tipo!: string;
  @Input() numero!: number;

  @Output() close = new EventEmitter<void>();
  loading: boolean = false;
  rangoErroneo: boolean = false;

  addFaseFlujo: any;
  addResponse: any;

  nombre: string = '';
  descripcion: string = '';
  fecha_inicio: string = '';
  fecha_termino: string = '';
  rut_creador: string = '';

  constructor(
    private elementRef: ElementRef,
    private httpRequestService: HttpRequestService,
  ) { }

  async onSubmit() {
    if (!this.nombre || !this.descripcion || !this.fecha_inicio || !this.fecha_termino) {
      return;
    }
    this.loading = true;

    const formattedFechaInicio = new Date(this.fecha_inicio).toISOString().slice(0, 19).replace('T', ' ');
    const formattedFechaTermino = new Date(this.fecha_termino).toISOString().slice(0, 19).replace('T', ' ');

    if (new Date(formattedFechaInicio) > new Date(formattedFechaTermino)) {
      this.rangoErroneo = true;
      this.loading = false;
      return;
    }
    this.addFaseFlujo = {
      nombre: this.nombre,
      descripcion: this.descripcion,
      fecha_inicio: formattedFechaInicio,
      fecha_termino: formattedFechaTermino,
      rut_creador: this.userRepresentation.rut,
      id_flujo: this.id_flujo,
      tipo: this.tipo,
      numero: this.numero
    }

    try {
      await this.add(this.addFaseFlujo);
    } catch (error) {
      console.log('Error adding fase flujo');
    } finally {
      this.loading = false;
      this.closeOverlay();
    }
  }

  async add(faseFlujo: any) {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.addFaseFlujo(faseFlujo).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.addResponse = data;
            resolve();
          },
          (error: any) => {
            console.error('Error adding fase flujo');
            reject(error);
          }
        );
      });
    });
  }

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

}
