import {Component, Input, OnInit} from '@angular/core';
import {HttpRequestService} from '../../Http-request.service';
import {FormControl} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';
import {forceAutocomplete} from '@angular/cli/src/utilities/environment-options';

export interface Profesor {
  nombre: string;
  rut: string;
  email: string;
}

const ELEMENT_DATA: Profesor[] = [
  {nombre:'Placeholder', rut: '111111', email: 'placeholder@pt.me'},
];

@Component({
  selector: 'app-ver-avances',
  templateUrl: './ver-avances.component.html',
  styleUrl: './ver-avances.component.scss'
})
export class VerAvancesComponent implements OnInit{
  @Input() tema!: any;
  @Input() userRepresentation!: any;

  loading: boolean = false;
  esCargo: boolean = false;

  protected avances!: any;
  protected revisores!: any;
  protected profesores!: any;
  profesorSeleccionado: any;

  protected dataSource: Profesor[] = [];
  displayedColumns: string[] = ['nombre', 'email', 'Activar Revision', 'Sacar'];

  constructor(
    private httpRequestService: HttpRequestService
  ){}

  async ngOnInit() {
    this.loading = true;
    try {
      await this.fetchAvances();
      await this.fetchProfesores();
      this.dataSource = ELEMENT_DATA;
    } catch (e) {
      this.avances = null;
    } finally {
      this.loading = false;
    }
    this.esCargo = this.userRepresentation?.tipo === 'cargo';

  }

  async fetchAvances() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getAvancesTema(this.tema.id).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.avances = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching avances');
            reject(error);
          }
        );
      });
    });
  }

  async fetchProfesores() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getProfesores(this.userRepresentation.escuela).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.profesores = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching profesores');
            reject(error);
          }
        );
      });
    });
  }

  activarRevision(element: Profesor) {
    // logica de activado
  }

  sacarRevisor(element: Profesor) {
    // logica de sacado
  }

  agregarRevisor() {
    // logica de agregado
  }

}
