import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {HttpRequestService} from '../../Http-request.service';

@Component({
  selector: 'app-editar-escuela',
  templateUrl: './editar-escuela.component.html',
  styleUrl: './editar-escuela.component.scss'
})
export class EditarEscuelaComponent {
  @Input() userRepresentation!: any;
  @Input() escuela!: any;

  @Output() close = new EventEmitter<void>();
  loading = true;
  nombre: any;
  cargo: any;

  profesores: any[] = [];
  escuelas: any[] = [];

  constructor(
    private elementRef: ElementRef,
    private httpRequestService: HttpRequestService,
  ) {}

  async ngOnInit() {
    try {
      this.nombre = this.escuela.nombre ? this.escuela.nombre : null;
      this.cargo = this.escuela.rut_profesor_cargo ? this.escuela.rut_profesor_cargo : null;
      await this.fetchProfesores();
    } catch (error) {
      console.error('Error fetching profesores');
    }
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

  onSubmit() {
    this.loading = true;
    if (!this.nombre || !this.cargo) {
      return;
    }
    this.loading = true;
    const escuela = {
      nombre: this.nombre,
      rut_profesor_cargo: this.cargo.rut,
    };
    this.editarEscuela(escuela).then(() => {
      this.loading = false;
      this.closeOverlay();
    }).catch((error) => {
      console.error('Error editando escuela:', error);
      this.loading = false;
    });
    this.loading = false;
  }

  async editarEscuela(escuela: any) {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.editarEscuela(escuela).then(observable => {
        observable.subscribe(
          (data: any) => {
            resolve();
          },
          (error: any) => {
            console.error('Error editando escuela');
            reject(error);
          }
        );
      });
    });
  }

  async fetchProfesores() {
    this.profesores = [];
    for (let escuela of this.escuelas) {
      await this.getProfesores(escuela);
    }
    this.profesores = this.profesores.filter((profesor, index, self) =>
        profesor.tipo === 'cargo' && // Filtrar solo profesores con tipo "cargo"
        index === self.findIndex((p) => (
          p.rut === profesor.rut
        ))
    );
  }

  async getProfesores(escuela: any) {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getProfesores(escuela.nombre).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.profesores.push(...data);
            resolve();
          },
          (error: any) => {
            console.error('Error obteniendo profesores');
            reject(error);
          }
        );
      });
    });
  }
}
