import {Component, Input, OnInit} from '@angular/core';
import {HttpRequestService} from '../../Http-request.service';

@Component({
  selector: 'app-editar-detalle',
  templateUrl: './editar-detalle.component.html',
  styleUrl: './editar-detalle.component.scss'
})
export class EditarDetalleComponent implements OnInit{
  @Input() userRepresentation!: any;
  @Input() tema!: any;

  loading: boolean = false;

  guardando: boolean = false;

  protected titulo: string = '';
  protected estado: string = '';
  protected resumen: string = '';
  protected escuela: string = '';
  protected guia: string = '';

  protected escuelas: string[] = [];

  protected profesores: string[] = [];

  private originalData: any = {};
  private editResponse: any = {};

  constructor(
    private httpRequestService: HttpRequestService
  ) {}

  ngOnInit() {
    this.setOriginalData();
  }

  setOriginalData() {
    this.originalData = {
      titulo: this.tema.titulo,
      estado: this.tema.estado,
      resumen: this.tema.resumen,
      escuela: this.tema.nombre_escuela,
      guia: this.tema.guia
    };
    this.profesores.push(this.tema.guia);
    this.escuelas.push(this.tema.nombre_escuela);
    this.resetForm();
  }

  resetForm() {
    this.titulo = this.originalData.titulo;
    this.estado = this.originalData.estado;
    this.resumen = this.originalData.resumen;
    this.escuela = this.originalData.escuela;
    this.guia = this.originalData.guia;
  }

  async onSubmit() {
    this.guardando = true;
    try {
      this.estado !== this.originalData.estado ? await this.cambiarEstado(this.estado) : await this.editarTema();
    } catch (error) {
      console.error('Error al editar tema');
    } finally {
      this.guardando = false;
    }
  }

  async editarTema() {
    const tema = {
      id: this.tema.id,
      titulo: this.titulo,
      resumen: this.resumen,
      nombre_escuela: this.tema.nombre_escuela,
      rut_guia: this.tema.rut_guia,
      numero_fase: this.tema.numero_fase
    }

    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.editTema(tema).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.editResponse = data;
            resolve();
          },
          (error: any) => {
            console.error('Error editing tema');
            reject(error);
          }
        );
      });
    });
  }

  async cambiarEstado(estado: string) {
    const tema = {
      id: this.tema.id,
      estado: estado
    }
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.cambiarEstadoTema(tema).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.editResponse = data;
            resolve();
          },
          (error: any) => {
            console.error('Error changing tema status');
            reject(error);
          });
      });
    });
  }

  onCancel() {
    this.resetForm();
  }
}
