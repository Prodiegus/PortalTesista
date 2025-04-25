import {Component, Input, OnInit} from '@angular/core';
import {HttpRequestService} from '../../Http-request.service';

@Component({
  selector: 'app-ver-reuniones',
  templateUrl: './ver-reuniones.component.html',
  styleUrl: './ver-reuniones.component.scss'
})
export class VerReunionesComponent implements OnInit{
  @Input() userRepresentation!: any;
  @Input() tema!: any;

  loading = false;
  crearReunion = false;
  editarReunion = false;

  reuniones: any = [];
  reunion: any = null;

  constructor(
    private httpRequestService: HttpRequestService
  ) {}

  async ngOnInit() {
    this.loading = true;
    try {
      await this.getReuniones();
    } catch (error) {
      console.error('Error fetching reuniones:', error);
    } finally {
      this.loading = false;
    }
  }

  async getReuniones() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getReuniones(this.tema.id).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.reuniones = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching reuniones');
            reject(error);
          }
        );
      });
    });
  }

  showCrearReunion() {
    this.crearReunion = true;
  }

  async cerrarCrearReunion() {
    this.crearReunion = false;
    await this.getReuniones();
  }

  verDetalleReunion(reunion: any) {
    this.editarReunion = true;
    this.reunion = reunion;
  }

  async cerrarEditarReunion() {
    this.editarReunion = false;
    await this.getReuniones();
  }
}
