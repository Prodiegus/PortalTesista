import { Component, ElementRef, EventEmitter, Host, HostListener, Input, OnInit, Output } from '@angular/core';
import { HttpRequestService } from '../Http-request.service';
import { tr } from 'date-fns/locale';

@Component({
  selector: 'app-detalle-fase',
  templateUrl: './detalle-fase.component.html',
  styleUrl: './detalle-fase.component.scss'
})
export class DetalleFaseComponent implements OnInit {
  @Input() userRepresentation!: any;
  @Input() fase!: any;
  @Input() id_flujo!: number;
  @Input() numeros: number[] = [];

  @Output() close = new EventEmitter<void>();
  loading: boolean = false;
  eliminando: boolean = false;
  rangoErroneo: boolean = false;

  editFase: any;
  editResponse: any;

  nombre: string = '';
  numero: number = 0;
  descripcion: string = '';
  fecha_inicio: string = '';
  fecha_termino: string = '';
  rut_creador: string = '';

  constructor(
    private httpRequestService: HttpRequestService,
    private elementRef: ElementRef
  ){}

  ngOnInit(): void {
    console.log(this.fase);
    this.nombre = this.fase.nombre;
    this.numero = this.fase.numero;
    this.descripcion = this.fase.descripcion;
    this.fecha_inicio = this.formatDateForInput(this.fase.fecha_inicio);
    this.fecha_termino = this.formatDateForInput(this.fase.fecha_termino);
    this.rut_creador = this.fase.rut_creador;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close.emit();
    }
  }

  async onSubmit() {
    this.loading = true;

    const formattedFechaInicio = new Date(this.fecha_inicio).toISOString().slice(0, 19).replace('T', ' ');
    const formattedFechaTermino = new Date(this.fecha_termino).toISOString().slice(0, 19).replace('T', ' ');

    if (new Date(formattedFechaInicio) > new Date(formattedFechaTermino)) {
      this.rangoErroneo = true;
      this.loading = false;
      return;
    }

    try {
      await this.editarFase();
    } catch (error) {
      console.log('Error editing fase flujo');
    } finally {
      this.loading = false;
      this.closeOverlay();
    }
  }

  async editarFase() {
    this.editFase = {
      id: this.fase.id,
      nombre: this.nombre,
      numero: this.numero,
      descripcion: this.descripcion,
      fecha_inicio: this.fecha_inicio,
      fecha_termino: this.fecha_termino,
      rut_creador: this.rut_creador,
      id_flujo: this.id_flujo
    };
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.editFaseFlujo(this.editFase).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.editResponse = data;
            resolve();
            this.closeOverlay();
          },
          (error: any) => {
            console.error('Error editing fase flujo');
            reject(error);
          }
        );
      });
    });
  }

  closeOverlay() {
    this.close.emit();
  }

  async eliminarFase() {
    this.eliminando = true;
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.deleteFaseFlujo(this.fase).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.editResponse = data;
            this.eliminando = false;
            resolve();
            this.closeOverlay();
          },
          (error: any) => {
            console.error('Error deleting fase flujo');
            reject(error);
          }
        );
      });
    });
  }

  private formatDateForInput(date: string): string {
    const d = new Date(date);
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
