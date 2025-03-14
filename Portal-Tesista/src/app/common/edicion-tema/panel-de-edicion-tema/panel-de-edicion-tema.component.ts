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
}
