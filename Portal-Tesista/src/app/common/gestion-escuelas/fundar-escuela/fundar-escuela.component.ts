import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {HttpRequestService} from '../../Http-request.service';

@Component({
  selector: 'app-fundar-escuela',
  templateUrl: './fundar-escuela.component.html',
  styleUrl: './fundar-escuela.component.scss'
})
export class FundarEscuelaComponent implements OnInit {
  @Input() userRepresentation!: any;
  @Input() escuelas!: any[];

  @Output() close = new EventEmitter<void>();
  loading = false;
  nombre: any;
  cargo: any;

  profesores: any[] = [];

  constructor(
    private elementRef: ElementRef,
    private httpRequestService: HttpRequestService,
  ) {}

  async ngOnInit() {
    try {
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
    this.crearEscuela(escuela).then(() => {
      this.loading = false;
      this.closeOverlay();
    }).catch((error) => {
      console.error('Error creando escuela:', error);
      this.loading = false;
    });
    this.closeOverlay();
  }

  async crearEscuela(escuela: any) {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.crearEscuela(escuela).then(observable => {
        observable.subscribe(
          (data: any) => {
            resolve();
          },
          (error: any) => {
            console.error('Error creando escuela');
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
