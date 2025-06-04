import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {UserService} from '../user.service';
import {HttpRequestService} from '../Http-request.service';

export interface Tema {
  id: number
  titulo: string
  resumen: string
  estado: string
  numero_fase: number
  id_fase: number
  nombre_escuela: string
  rut_guia: string
  guia: string
  co_guias: string[]
  creacion: string
}


@Component({
  selector: 'app-revisiones-tema',
  templateUrl: './revisiones-tema.component.html',
  styleUrl: './revisiones-tema.component.scss'
})
export class RevisionesTemaComponent implements  OnInit, AfterViewInit, AfterViewChecked {
  loading = true;
  userRepresentation: any;

  protected temas: any[] = [];

  avance: any;
  temaSeleccionado: any;
  revisar = false;

  paginatorInitialized = false;

  displayedColumns: string[] = ['Tema', 'Profesor Guía', 'Profesor co-Guía', 'Estado', 'Detalle'];
  dataSource: MatTableDataSource<Tema> = new MatTableDataSource<Tema>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private httpRequestService: HttpRequestService
  ) {}

  async ngOnInit() {
    this.loading = true;
    try {
      this.userRepresentation = this.userService.getUser();
      await this.fetchTemas();
    } catch (error) {
      console.error('Error fetching user representation:', error);
    } finally {
      this.loading = false;
    }
  }

  ngAfterViewInit() {
    this.assignPaginatorAndSort();
  }

  ngAfterViewChecked() {
    if (!this.paginatorInitialized) {
      this.assignPaginatorAndSort();
    }
  }

  applyFilter(event: Event) {
    if (this.dataSource) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  async fetchTemas() {
    return new Promise<Observable<any>>((resolve, reject) => {
      if (!this.userRepresentation || !this.userRepresentation.rut) {
        console.error('User representation or RUT is not available');
        reject('User representation or RUT is not available');
        return;
      }
      this.httpRequestService.getTemasRevisionUsuario(this.userRepresentation.rut).then(observable => {
        observable.subscribe(
          (data: any) => {
            let temas: any[] = [];
            this.temas = data;
            for (const tema of data){
              const temaData: Tema = {
                id: tema.id,
                titulo: tema.titulo,
                resumen: tema.resumen,
                estado: tema.estado,
                numero_fase: tema.numero_fase,
                id_fase: tema.id_fase,
                nombre_escuela: tema.nombre_escuela,
                rut_guia: tema.rut_guia,
                guia: tema.guia,
                co_guias: tema.co_guias,
                creacion: tema.creacion
              }
              temas.push(temaData);
            }
            this.dataSource = new MatTableDataSource(temas);

            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
            if (this.sort) {
              this.dataSource.sort = this.sort;
            }
            resolve(observable);
          },
          (error: any) => {
            console.error('Error fetching temas');
            reject(error);
          }
        );
      });
    });
  }

  async getAvanceTema(id: number) {
    return new Promise<Observable<any>>((resolve, reject) => {
      this.httpRequestService.getUltimoAvanceTema(id).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.avance = data;
            resolve(observable);
          },
          (error: any) => {
            console.error('Error fetching avance tema');
            reject(error);
          }
        );
      });
    });
  }
  async revisarTema(tema: any) {
    await this.getAvanceTema(tema.id);
    this.temaSeleccionado = tema;
    this.revisar = true;
  }

  closeRevisarTema() {
    this.revisar = false;
  }

  private assignPaginatorAndSort() {
    if (this.paginator && !this.paginatorInitialized) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginatorInitialized = true;
    }
  }

}
