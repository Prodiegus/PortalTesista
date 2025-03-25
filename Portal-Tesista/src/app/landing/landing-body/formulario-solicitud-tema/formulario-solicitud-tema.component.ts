import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {HttpRequestService} from '../../../common/Http-request.service';

@Component({
  selector: 'app-formulario-solicitud-tema',
  templateUrl: './formulario-solicitud-tema.component.html',
  styleUrl: './formulario-solicitud-tema.component.scss'
})
export class FormularioSolicitudTemaComponent implements OnInit{
  @Input() tema: any;
  @Output() close = new EventEmitter<void>();

  working: boolean = false;
  loading: boolean = false;

  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  rut: string = '';
  escuela: string = '';
  mensaje: string = '';

  escuelas: string[] = [];

  constructor(
    private elementRef: ElementRef,
    private httpRequestService: HttpRequestService
  ) {}

  async ngOnInit() {
    await this.fetchEscuelas();
  }

  async fetchEscuelas() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getEscuelas().then(observable => {
        observable.subscribe(
          (data: any) => {
            this.escuelas = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching escuelas');
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

  closeOverlay(){
    this.close.emit();
  }

  onSubmit(){
    if (this.nombre === '' || this.apellido === '' || this.correo === '' || this.rut === '' || this.escuela === '' || this.mensaje === '') {
      return;
    }
    const solicitud = {
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      rut: this.rut,
      escuela: this.escuela,
      mensaje: this.mensaje,
      tema: this.tema
    };
    try {
      this.solicitarTema(solicitud);
    } catch (error) {
      console.error('Error solicitando tema');
    } finally {
      this.closeOverlay();
    }
  }

  solicitarTema(solicitud: any) {
    console.log(solicitud);
  }

}
