import { Component, Input, OnInit } from '@angular/core';
import { tr } from 'date-fns/locale';
import { CONST } from '../../common/const/const';

@Component({
  selector: 'app-temas-view',
  templateUrl: './temas-view.component.html',
  styleUrl: './temas-view.component.scss'
})
export class TemasViewComponent implements OnInit{
  @Input() userRepresentation: any;

  loading = true;
  agregarTema = true;
  verDetalle = false;

  temaSeleccionado: any;

  protected temas = CONST.temas;

  ngOnInit(): void {
    this.loading = false;
  }

  showAgregarTema() {
    this.agregarTema = true;
  }

  detalleTema(tema: any){
    this.temaSeleccionado = tema;
    this.verDetalle = true;
  }

  closeAddTema(){
    this.agregarTema = false;
  }
}
