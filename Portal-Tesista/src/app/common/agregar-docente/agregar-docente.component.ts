import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-agregar-docente',
  templateUrl: './agregar-docente.component.html',
  styleUrl: './agregar-docente.component.scss'
})
export class AgregarDocenteComponent {
  @Output() close = new EventEmitter<void>();
  loading: boolean = false;

  addDocente: any;

  closeOverlay() {
    this.close.emit();
  }
}
