import { Component, Output, EventEmitter, ElementRef, HostListener, Input } from '@angular/core';
import { HttpRequestService } from '../Http-request.service';

@Component({
  selector: 'app-agregar-docente',
  templateUrl: './agregar-docente.component.html',
  styleUrl: './agregar-docente.component.scss'
})
export class AgregarDocenteComponent {
  @Input() userRepresentation!: any;

  @Output() close = new EventEmitter<void>();
  loading: boolean = false;

  addDocente: any;
  addResponse: any;

  nombre: string = '';
  apellido: string = '';
  rut: string = '';
  correo: string = '';
  tipo: string = '';

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

  async onSubmit() {
    if (!this.nombre || !this.apellido || !this.rut || !this.correo || !this.tipo) {
      return;
    }
    this.loading = true;
    this.addDocente = {
      nombre: this.nombre,
      apellido: this.apellido,
      rut: this.rut,
      correo: this.correo,
      escuela: this.userRepresentation.escuela,
      tipo: this.tipo.valueOf(),
      activo: 1
    };
    try {
      await this.add(this.addDocente);
      console.log(this.addResponse);
    } catch (error) {
      console.log('Error adding docente');
    } finally {
      this.loading = false;
      this.closeOverlay();
    }
  }

  private async add(addDocente: string | undefined) {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.addDocente(addDocente).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.addResponse = data;
            resolve();
          },
          (error: any) => {
            reject(error);
          });
        });
      }
    );
  }
}
