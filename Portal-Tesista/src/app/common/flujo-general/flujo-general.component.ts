import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpRequestService } from '../Http-request.service';


@Component({
  selector: 'app-flujo-general',
  templateUrl: './flujo-general.component.html',
  styleUrl: './flujo-general.component.scss'
})
export class FlujoGeneralComponent implements OnInit {
  loading = true;
  userRepresentation: any;
  flujoGeneral: any;
  fasesFlujo: any;
  faseSeleccionada: any;
  numeros: number[] = [];
  protected showDetalleFase = false;
  protected showAgregarFase = false;

  constructor(
    private userService: UserService,
    private httpRequestService: HttpRequestService,
  ) {}

  async ngOnInit() {
    try {
      this.userRepresentation = this.userService.getUser();
      await this.fetchFlujoGeneral();
      await this.fetchFasesFlujo();
    } catch (error) {
      console.error('Error initializing FlujoGeneralComponent'); 
    } finally {
      this.loading = false;
    }
  }

  async fetchFlujoGeneral() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getFlujosGenerales(this.userRepresentation.escuela).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.flujoGeneral = undefined;
            for (const flujo of data) {
              if (flujo.rut_creador === this.userRepresentation.rut) {
                this.flujoGeneral = flujo;
                break;
              }
            }
            if (!this.flujoGeneral) {
              console.error('No se encontró flujo general para el usuario');
              reject('No flujoGeneral');
              return;
            }
            resolve();
          },
          (error: any) => {
            console.error('Error fetching flujo general');
            reject(error);
          }
        );
      });
    });
  }

  async fetchFasesFlujo() {
    if (!this.flujoGeneral || !this.flujoGeneral.id) {
      console.error('flujoGeneral no definido o sin id');
      return;
    }
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getFasesFlujo(this.flujoGeneral.id).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.fasesFlujo = data.sort((a: any, b: any) => a.numero - b.numero);
            this.numeros = this.fasesFlujo.map((fase: any) => fase.numero);
            resolve();
          },
          (error: any) => {
            console.error('Error fetching fases flujo');
            reject(error);
          }
        );
      });
    });
  }

  toggleAddPhase() {
    this.showAgregarFase =true;
  }

  async closeAddPhase() {
    this.showAgregarFase = false;
    this.loading = true;
    await this.fetchFasesFlujo();
    await this.fetchFlujoGeneral();
    this.loading = false;
  }
  abrirDetalleFase(fase: any) {
    this.faseSeleccionada = fase;
    this.showDetalleFase = true;
  }

  async closeDetalleFase() {
    this.showDetalleFase = false;
    this.loading = true;
    await this.fetchFasesFlujo();
    await this.fetchFlujoGeneral();
    this.loading = false;
  }
}
