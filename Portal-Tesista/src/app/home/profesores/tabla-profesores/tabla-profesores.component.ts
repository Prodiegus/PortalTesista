import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-tabla-profesores',
  templateUrl: './tabla-profesores.component.html',
  styleUrls: ['./tabla-profesores.component.scss']
})
export class TablaProfesoresComponent {
  @Input() profesores: any;
  showAgregarDocente: boolean = false;

  verProfe(profesor: any) {
    console.log(profesor);
  }

  desactivar(profesor: any) {
    console.log(profesor);
  }

  activar(profesor: any) {
    console.log(profesor);
  }

  agregarProfesor() {
    this.showAgregarDocente = true;
  }

  closeAgregarDocente() {
    this.showAgregarDocente = false;
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.closeAgregarDocente();
    }
  }
}
