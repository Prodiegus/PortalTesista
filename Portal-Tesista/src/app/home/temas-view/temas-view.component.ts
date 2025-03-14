import { Component, Input, OnInit } from '@angular/core';
import { tr } from 'date-fns/locale';
import { CONST } from '../../common/const/const';
import {observable} from 'rxjs';
import {UserService} from '../../common/user.service';
import { HttpRequestService } from '../../common/Http-request.service';

@Component({
  selector: 'app-temas-view',
  templateUrl: './temas-view.component.html',
  styleUrl: './temas-view.component.scss'
})
export class TemasViewComponent implements OnInit{
  @Input() userRepresentation: any;

  loading = true;
  agregarTema = false;
  verDetalle = false;

  temaSeleccionado: any;

  protected temas: any[] = [];

  constructor(
    private userService: UserService,
    private httpRequestService: HttpRequestService,
  ) {}

  async ngOnInit() {
    await this.fetchTemas();
    this.loading = false;
  }

  async fetchTemas(){
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getTemasUsuario(this.userRepresentation.rut).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.temas = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching temas');
            reject(error);
          }
        );
      });
    });
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
