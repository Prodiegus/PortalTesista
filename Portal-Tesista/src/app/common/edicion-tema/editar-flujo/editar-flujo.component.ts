import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {HttpRequestService} from '../../Http-request.service';

interface FaseConSubfase {
  id: number;
  numero: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  fecha_inicio: string;
  fecha_termino: string;
  rut_creador: string;
  id_flujo: number;
  id_padre?: number;
  subfases: fase[];
}

interface fase {
  id: number;
  numero: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  fecha_inicio: string;
  fecha_termino: string;
  rut_creador: string;
  id_flujo: number;
  id_padre?: number;
}

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

  subfasesGuia = false;
  subfasesAlumno = false;
  faseShowNumero = 0;
  subfaseShowNumero = 0;

  id_padre = 0;
  agregarFasePopup = false;

  showDetalleFase = false;
  faseSeleccionada: any;

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
    await this.fetchFasesTema();
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

  private async fetchFasesTema() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getFasesTema(this.tema.id).then(observable => {
        observable.subscribe(
          (data: any) => {
            let fasesConSubfases: FaseConSubfase[] = [];
            for (const fase of this.fasesFlujo) {
              let faseConSubfase: FaseConSubfase = {
                id: fase.id,
                numero: fase.numero,
                nombre: fase.nombre,
                descripcion: fase.descripcion,
                tipo: fase.tipo,
                fecha_inicio: fase.fecha_inicio,
                fecha_termino: fase.fecha_termino,
                rut_creador: fase.rut_creador,
                id_flujo: fase.id_flujo,
                subfases: [],
              };
              data = data.sort((a: any, b: any) => a.numero - b.numero);
              for (const subfase of data) {
                if (fase.id === subfase.id_padre) {
                  const faseSub: FaseConSubfase = {
                    id: subfase.id,
                    numero: subfase.numero,
                    nombre: subfase.nombre,
                    descripcion: subfase.descripcion,
                    tipo: subfase.tipo,
                    fecha_inicio: subfase.fecha_inicio,
                    fecha_termino: subfase.fecha_termino,
                    rut_creador: subfase.rut_creador,
                    id_flujo: subfase.id_flujo,
                    subfases: [],
                  }
                  for (const subsubfase of data) {
                    if (subfase.id === subsubfase.id_padre) {
                      const subsubfaseObj: fase = {
                        id: subsubfase.id,
                        numero: subsubfase.numero,
                        nombre: subsubfase.nombre,
                        descripcion: subsubfase.descripcion,
                        tipo: subsubfase.tipo,
                        fecha_inicio: subsubfase.fecha_inicio,
                        fecha_termino: subsubfase.fecha_termino,
                        rut_creador: subsubfase.rut_creador,
                        id_flujo: subsubfase.id_flujo,
                      }
                      faseSub.subfases.push(subsubfaseObj);
                    }
                  }
                  faseConSubfase.subfases.push(faseSub);
                }
              }
              fasesConSubfases.push(faseConSubfase);
            }
            console.log(fasesConSubfases);
            this.fasesFlujo = fasesConSubfases;
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
    this.id_padre = fase.id;
    this.agregarFasePopup = true;
  }

  async closeAgregarFase() {
    this.agregarFasePopup = false;
    try {
      this.loading = true;
      await this.fetchFlujoGeneral();
      await this.fetchFasesFlujo();
      await this.fetchFasesTema();
    } catch (error) {
      console.error('Error fetching flujo general or fases flujo:', error);
    } finally {
      this.loading = false;
    }
  }

  abrirDetalleFase(fase: any, subfase: any) {
    this.faseSeleccionada = subfase;
    for (let i = 0; i < fase.subfases.length; i++) {
      this.numeros.push(fase.subfases[i].numero);
    }
    this.showDetalleFase = true;
  }

  async closeDetalleFase(){
    this.showDetalleFase = false;
    this.faseSeleccionada = null;
    this.numeros = [];
    try {
      this.loading = true;
      await this.fetchFlujoGeneral();
      await this.fetchFasesFlujo();
      await this.fetchFasesTema();
    } catch (error) {
      console.error('Error fetching flujo general or fases flujo:', error);
    } finally {
      this.loading = false;
    }
  }

  toggleSubfasesGuia(i: number) {
    this.subfasesGuia = !this.subfasesGuia;
    this.faseShowNumero = i;
  }
  toggleSubfasesAlumno(i: number) {
    this.subfasesAlumno = !this.subfasesAlumno;
    this.subfaseShowNumero = i;
  }
}
