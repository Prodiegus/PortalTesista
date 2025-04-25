import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {HttpRequestService} from '../Http-request.service';
import {observable} from 'rxjs';
import {addWarning} from '@angular-devkit/build-angular/src/utils/webpack-diagnostics';

@Component({
  selector: 'app-crear-reunion',
  templateUrl: './crear-reunion.component.html',
  styleUrls: ['./crear-reunion.component.scss']
})
export class CrearReunionComponent {
  @Input() userRepresentation: any;
  @Input() tema: any;
  @Output() close = new EventEmitter<void>();

  fecha_inicio = new Date();
  fecha_termino = new Date();
  frecuencia_dias:number = 0;
  frecuencia = 'unica';

  error: boolean = false;
  loading: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private httpRequestService: HttpRequestService
  ) {}

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

  async crearReunion() {
    const nuevaReunion = {
      id_tema: this.tema.id,
      rut_coordinador: this.userRepresentation.rut,
      fecha_inicio: this.fecha_inicio,
      fecha_termino: this.fecha_termino,
      frecuencia_dias: this.frecuencia_dias,
    };
    this.loading = true;
    await this.crearReunionHttp(nuevaReunion);
  }

  async crearReunionHttp(reunion: any){
    return new Promise<any>((resolve, reject) => {
      this.httpRequestService.crearReuniones(reunion).then(observable => {
        observable.subscribe((response: any) => {
          this.closeOverlay();
          resolve(response);
        }, (error: any) => {
          console.error('Error al crear la reunión:', error);
          this.error = true;
          this.loading = false;
          reject(error);
        });
      });
    });
  }

  actualizarFrecuencia() {
      const inicio = new Date(this.fecha_inicio);
    switch (this.frecuencia) {
      case 'unica':
        this.fecha_termino = new Date(inicio);
        this.frecuencia_dias = 0;
        break;
      case 'diaria':
        this.frecuencia_dias = 1;
        break;
      case 'semanal':
        this.frecuencia_dias = 7;
        break;
      case 'bisemanal':
        this.frecuencia_dias = 14;
        break;
    }
  }
  cancelar() {
    this.closeOverlay();
  }
}
