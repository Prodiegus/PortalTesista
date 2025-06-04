import {AfterViewChecked, AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {HttpRequestService} from '../../Http-request.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

export interface Reunion {
  id: number,
  fecha: string,
  resumen: string,
  estado: string,
  rut_coordinador: string,
  id_tema: number,
}

@Component({
  selector: 'app-ver-reuniones',
  templateUrl: './ver-reuniones.component.html',
  styleUrl: './ver-reuniones.component.scss'
})
export class VerReunionesComponent implements OnInit, AfterViewInit, AfterViewChecked{
  @Input() userRepresentation!: any;
  @Input() tema!: any;


  loading = false;
  crearReunion = false;
  editarReunion = false;

  reuniones: any = [];
  protected reunion: any = null;

  paginatorInitialized = false;
  displayedColumns: string[] = ['Fecha', 'Hora', 'Estado', 'Detalle'];
  dataSource: MatTableDataSource<Reunion> = new MatTableDataSource<Reunion>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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

  ngAfterViewInit() {
    this.assignPaginatorAndSort();
  }

  ngAfterViewChecked() {
    if (!this.paginatorInitialized) {
      this.assignPaginatorAndSort();
    }
  }
  private assignPaginatorAndSort() {
    if (this.paginator && !this.paginatorInitialized) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginatorInitialized = true;
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

  async getReuniones() {
    return new Promise<void>((resolve, reject) => {
      if (!this.tema || !this.tema.id) {
        console.error('Tema no disponible o sin ID');
        reject('Tema no disponible o sin ID');
        return;
      }
      this.httpRequestService.getReuniones(this.tema.id).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.reuniones =this.parsearToReuniones(this.ordenarReuniones(data));
            this.dataSource = new MatTableDataSource(this.reuniones);
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
            if (this.sort) {
              this.dataSource.sort = this.sort;
            }
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

  parsearToReuniones(data: any[]) {
    return data.map((reunion: any) => ({
      id: reunion.id,
      fecha: reunion.fecha,
      resumen: reunion.resumen,
      estado: reunion.estado,
      rut_coordinador: reunion.rut_coordinador,
      id_tema: reunion.id_tema
    }));
  }

  ordenarReuniones(reuniones: any[]): any[] {
    return reuniones.sort((a: any, b: any) => {
      // Normalizar estado a minúsculas
      const estadoA = a.estado.toLowerCase();
      const estadoB = b.estado.toLowerCase();

      // Priorizar 'pendiente' sobre 'completado'
      if (estadoA === 'pendiente' && estadoB === 'completado') return -1;
      if (estadoA === 'completado' && estadoB === 'pendiente') return 1;

      // Ordenar por fecha
      const dateA = new Date(a.fecha).getTime();
      const dateB = new Date(b.fecha).getTime();

      // Ascendente (más antiguas primero) para 'pendiente'
      if (estadoA === 'pendiente') return dateA - dateB;

      // Descendente (más recientes primero) para 'completado'
      return dateB - dateA;
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
