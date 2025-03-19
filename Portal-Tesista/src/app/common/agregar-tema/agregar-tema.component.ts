import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { HttpRequestService } from '../Http-request.service';

@Component({
  selector: 'app-agregar-tema',
  templateUrl: './agregar-tema.component.html',
  styleUrl: './agregar-tema.component.scss'
})
export class AgregarTemaComponent {
  @Input() userRepresentation!: any;

  @Output() close = new EventEmitter<void>();

  protected titulo: string = '';
  protected resumen: string = '';

  loading = false;

  constructor(
    private elementRef: ElementRef,
    private httpRequestService: HttpRequestService
  ) { }

  async onSubmit() {
    this.loading = true;
    if (this.titulo === '' || this.resumen === '') {
      this.loading = false;
      return;
    }

    const tema = {
      titulo: this.titulo,
      resumen: this.resumen,
      nombre_escuela: this.userRepresentation.escuela,
      rut_guia: this.userRepresentation.rut
    };

    try {
      await this.crearTema(tema);
    } catch (error) {
      console.error('Error creando tema');
    } finally {
      this.loading = false;
      this.closeOverlay();
    }
  }

  async crearTema(tema: any){
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.addTema(tema).then(observable => {
        observable.subscribe(
          (data: any) => {
            resolve();
          },
          (error: any) => {
            console.error('Error creando tema');
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
