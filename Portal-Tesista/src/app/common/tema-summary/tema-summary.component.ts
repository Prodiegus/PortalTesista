import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpRequestService} from '../Http-request.service';

@Component({
  selector: 'app-tema-summary',
  templateUrl: './tema-summary.component.html',
  styleUrl: './tema-summary.component.scss'
})
export class TemaSummaryComponent implements OnInit {
  @Input() tema: any;
  @Input() userRepresentation: any;

  edicion: boolean = false;
  loading: boolean = false;

  avance: number = 70;

  constructor(
    private router: Router,
    private httpRequestService: HttpRequestService
  ) { }

  ngOnInit() {
    this.avance = 70;
  }

  edicionTema() {
    this.router.navigate(['/home/editar-tema', this.tema.id], {
      state: {
        tema: this.tema,
        userRepresentation: this.userRepresentation
      }
    });
  }


  async faseAnterior() {
    this.loading = true;
    try {
      await this.fasePrevia(this.tema.id);
    } catch (error) {
      console.error('Error al avanzar a la fase anterior:', error);
    } finally {
      this.loading = false;
    }
  }
  async faseSiguiente() {
    this.loading = true;
    try {
      await this.siguenteFase(this.tema.id);
    } catch (error) {
      console.error('Error al avanzar a la siguiente fase:', error);
    } finally {
      this.loading = false;
    }
  }

  async siguenteFase(id_tema: any) {
    return new Promise((resolve, reject) => {
      this.httpRequestService.faseSiguiente(id_tema).then(observable => {
        observable.subscribe(
          (data: any) => {
            resolve(data);
          },
          (error: any) => {
            console.error('Error al avanzar a la siguiente fase:', error);
            reject(error);
          }
        );
      });
    });
  }
  async fasePrevia(id_tema: any) {
    return new Promise((resolve, reject) => {
      this.httpRequestService.faseAnterior(id_tema).then(observable => {
        observable.subscribe(
          (data: any) => {
            resolve(data);
          },
          (error: any) => {
            console.error('Error al avanzar a la fase anterior:', error);
            reject(error);
          }
        );
      });
    });
  }

}
