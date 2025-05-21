import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-panel-de-edicion-tema',
  templateUrl: './panel-de-edicion-tema.component.html',
  styleUrl: './panel-de-edicion-tema.component.scss'
})
export class PanelDeEdicionTemaComponent {
  @Input() tema!: any;
  @Input() userRepresentation!: any;

  loading: boolean = false;

  detalle: boolean = true;
  flujo: boolean = false;
  avances: boolean = false;
  reuniones: boolean = false;
  duenos: boolean = false;
  coGuia: boolean = false;

  constructor(
    private router: Router
  ) {}

  goVistaGenera(){
    this.router.navigate(['/home/tema', this.tema.id], {
      state: {
        tema: this.tema,
        userRepresentation: this.userRepresentation
      }
    });
  }

  selectDetalle() {
    this.detalle = true;
    this.flujo = false;
    this.avances = false;
    this.reuniones = false;
    this.duenos = false;
    this.coGuia = false;
  }

  selectReunione() {
    this.detalle = false;
    this.flujo = false;
    this.avances = false;
    this.reuniones = true;
    this.duenos = false;
    this.coGuia = false;
  }

  selectAvances() {
    this.detalle = false;
    this.flujo = false;
    this.avances = true;
    this.reuniones = false;
    this.duenos = false;
    this.coGuia = false;
  }

  selectFlujo() {
    this.detalle = false;
    this.flujo = true;
    this.avances = false;
    this.reuniones = false;
    this.duenos = false;
    this.coGuia = false;
  }

  selectDuenos() {
    this.detalle = false;
    this.flujo = false;
    this.avances = false;
    this.reuniones = false;
    this.duenos = true;
    this.coGuia = false;
  }

  selectCoGuia() {
    this.detalle = false;
    this.flujo = false;
    this.avances = false;
    this.reuniones = false;
    this.duenos = false;
    this.coGuia = true;
  }
}
