import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {HttpRequestService} from '../../Http-request.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-editar-escuela',
  templateUrl: './editar-escuela.component.html',
  styleUrl: './editar-escuela.component.scss'
})
export class EditarEscuelaComponent implements OnInit{
  @Input() userRepresentation!: any;
  @Input() escuela: any;
  @Input() escuelas!: any[];

  @Output() close = new EventEmitter<void>();
  loading = true;
  editando = false;
  nombre: any;
  cargo: any;

  profesores: any[] = [];

  constructor(
    private elementRef: ElementRef,
    private httpRequestService: HttpRequestService,
    private dialog : MatDialog,
  ) {}

  async ngOnInit() {
    this.loading = true;
    try {
      this.nombre = this.escuela.nombre ? this.escuela.nombre : null;
      await this.fetchProfesores().then(() => {
        this.cargo = this.profesores.find((profesor) => profesor.rut === this.escuela.rut_profesor_cargo);
      });
    } catch (error) {
      console.error('Error fetching profesores');
    } finally {
      this.loading = false;
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
    this.editando = true;
    const escuela = {
      nombre: this.escuela.nombre,
      rut_profesor_cargo: this.cargo ? this.cargo.rut : this.escuela.rut_profesor_cargo,
    };
    this.editarEscuela(escuela).then(() => {
      this.editando = false;
      this.closeOverlay();
    }).catch((error) => {
      console.error('Error editando escuela:', error);
      this.editando = false;
    });
    this.editando = false;
    this.closeOverlay();
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
