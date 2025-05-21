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
  async cerrarFundarEscuela() {
    try {
        this.loading = true;
        await this.sleep(500); // Simulate a delay
        this.fetchEscuelas().then(() => {
        this.fundarEscuelaPopup = false;
        this.loading = false;
      });
    } catch (error) {
      console.error('Error fetching escuelas after closing fundarEscuelaPopup:', error);
      this.loading = false;
    }
  }
  async cerrarEdicionEscuela() {
  try {
    this.loading = true;
    await this.sleep(500); // Simulate a delay
    await this.fetchEscuelas().then(() => {
      this.editarEscuelaPopup = false;
      this.loading = false;
    });
  } catch (error) {
    console.error('Error fetching escuelas after closing editarEscuelaPopup:', error);
    this.loading = false;
  }
}
   async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected readonly escape = escape;
}
