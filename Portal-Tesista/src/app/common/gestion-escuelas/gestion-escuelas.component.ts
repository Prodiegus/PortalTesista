import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {HttpRequestService} from '../Http-request.service';

@Component({
  selector: 'app-gestion-escuelas',
  templateUrl: './gestion-escuelas.component.html',
  styleUrl: './gestion-escuelas.component.scss'
})
export class GestionEscuelasComponent implements OnInit{
  loading = true;
  userRepresentation: any;
  fundarEscuelaPopup = false;
  editarEscuelaPopup = false;
  escuelaSeleccionada: any;

  protected escuelas: any[] = [];

  constructor(
    private userService: UserService,
    private httpRequestService: HttpRequestService
  ) {}

  async ngOnInit() {
    this.loading = true;
    try {
      this.userRepresentation = this.userService.getUser();
      await this.fetchEscuelas();
    } catch (error) {
      console.error('Error fetching user representation:', error);
    } finally {
      this.loading = false;
    }
  }

  async fetchEscuelas() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getEscuelas().then(observable => {
        observable.subscribe(
          (data: any) => {
            this.escuelas = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching escuelas');
            reject(error);
          }
        )
      });
    });
  }

  fundarEscuela() {
    this.fundarEscuelaPopup = true;
  }
  verEscuela(escuela: any) {
    this.escuelaSeleccionada = escuela;
    this.editarEscuelaPopup = true;
  }
  cerrarFundarEscuela() {
    this.fundarEscuelaPopup = false;
  }
  async cerrarEdicionEscuela() {
    await this.fetchEscuelas();
    this.editarEscuelaPopup = false;
  }

  protected readonly escape = escape;
}
