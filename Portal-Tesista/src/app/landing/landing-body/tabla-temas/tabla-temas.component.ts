import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpRequestService} from '../../../common/Http-request.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

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
  selector: 'app-tabla-temas',
  templateUrl: './tabla-temas.component.html',
  styleUrl: './tabla-temas.component.scss',
})
export class TablaTemasComponent implements OnInit, AfterViewInit, AfterViewChecked{
  protected temas:any[] = [];
  loading = true;
  protected detalle = false;
  protected formulario = false;
  temaSeleccionado: any;

  paginatorInitialized = false;

  displayedColumns: string[] = ['Tema', 'Profesor Guía', 'Profesor co-Guía', 'Estado', 'Detalle'];
  dataSource: MatTableDataSource<Tema> = new MatTableDataSource<Tema>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private httpRequestService: HttpRequestService
  ) {}

  async ngOnInit() {
    try {
      await this.fetchTemas();
    } catch (error) {
      console.error('Error fetching temas');
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

  async fetchTemas(): Promise<Observable<any>> {
    return new Promise<Observable<any>>((resolve, reject) => {
      this.httpRequestService.getTemas().then(observable => {
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

  detalleTema(tema: any) {
    this.temaSeleccionado = tema;
    this.detalle = true;
  }

  detalleTemaClose() {
    this.detalle = false;
  }

  solicitarTema() {
    this.detalleTemaClose();
    this.formulario = true;
  }

  solicitarTemaClose() {
    this.formulario = false;
  }

  private assignPaginatorAndSort() {
    if (this.paginator && !this.paginatorInitialized) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginatorInitialized = true;
    }
  }

}
