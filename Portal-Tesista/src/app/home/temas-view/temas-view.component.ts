import { Component, Input, OnInit } from '@angular/core';
import { tr } from 'date-fns/locale';
import { CONST } from '../../common/const/const';
import {observable} from 'rxjs';
import {UserService} from '../../common/user.service';
import { HttpRequestService } from '../../common/Http-request.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-temas-view',
  templateUrl: './temas-view.component.html',
  styleUrl: './temas-view.component.scss'
})
export class TemasViewComponent implements OnInit{
  @Input() userRepresentation: any;

  loading = true;
  agregarTema = false;

  protected temas: any[] = [];

  constructor(
    private userService: UserService,
    private httpRequestService: HttpRequestService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.fetchTemas();
    if (this.temas.length == 1 && this.userRepresentation.tipo === 'alumno') {
      this.detalleTema(this.temas[0]);
    }
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
    this.router.navigate(['/home/tema', tema.id], {
        state: {
          tema: tema,
          userRepresentation: this.userRepresentation
        }
      });
  }

  closeAddTema(){
    this.agregarTema = false;
    this.loading = true;
    this.fetchTemas().then(() => {
      this.loading = false;
    });
  }
}
