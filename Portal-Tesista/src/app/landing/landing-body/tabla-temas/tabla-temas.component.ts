import { Component } from '@angular/core';
import { CONST } from '../../../common/const/const';

@Component({
  selector: 'app-tabla-temas',
  templateUrl: './tabla-temas.component.html',
  styleUrl: './tabla-temas.component.scss'
})
export class TablaTemasComponent {
  protected temas = CONST.temas;

  detalleTema(tema: any) {
    console.log(tema);
  }

}
