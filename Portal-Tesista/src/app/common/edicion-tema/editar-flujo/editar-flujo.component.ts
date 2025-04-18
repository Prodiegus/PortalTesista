import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {HttpRequestService} from '../../Http-request.service';

@Component({
  selector: 'app-editar-flujo',
  templateUrl: './editar-flujo.component.html',
  styleUrl: './editar-flujo.component.scss'
})
export class EditarFlujoComponent implements OnInit{
  @Input() userRepresentation!: any;
  @Input() tema!: any;

  loading = true;
  flujoGeneral: any;
  fasesFlujo: any;
  numeros: number[] = [];

  constructor(
    private router: Router,
    private httpRequestService: HttpRequestService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation?.extras?.state) {
      this.userRepresentation = navigation.extras.state['userRepresentation'];
      this.tema = navigation.extras.state['tema'];
    }
  }

async ngOnInit() {
  if (!this.userRepresentation || !this.tema) {
    this.router.navigate(['/home']);
    return;
  }

  if (this.userRepresentation.tipo !== 'alumno' && this.tema.estado !== 'Pendiente') {
    alert('El flujo solo puede ser editado cuando el tema no está en trabajo');
    return;
  }
  try {
    await this.fetchFlujoGeneral();
    await this.fetchFasesFlujo();
  } catch (error) {
    console.error('Error fetching flujo general or fases flujo:', error);
  } finally {
    this.loading = false;
  }
}

  private async fetchFlujoGeneral() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getFlujosGenerales(this.userRepresentation.escuela).then(observable => {
        observable.subscribe(
          (data: any) => {
            for (const flujo of data) {
                this.flujoGeneral = flujo;
                break;
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

  private async fetchFasesFlujo() {
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

  agregarFase(fase: any) {

  }
}
