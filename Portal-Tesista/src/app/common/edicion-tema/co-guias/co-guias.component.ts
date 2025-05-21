import {AfterViewChecked, AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {HttpRequestService} from '../../Http-request.service';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

export interface profesor {
  rut: string;
  nombre: string;
  correo: string;
}

@Component({
  selector: 'app-co-guias',
  templateUrl: './co-guias.component.html',
  styleUrl: './co-guias.component.scss'
})
export class CoGuiasComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @Input() userRepresentation!: any;
  @Input() tema!: any;

  loading: boolean = true;
  esGuia: boolean = false;

  profesores: profesor[] = [];

  paginatorInitialized = false;
  displayedColumns: string[] = ['Nombre', 'Correo', 'Quitar'];
  dataSource: MatTableDataSource<profesor> = new MatTableDataSource<profesor>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private httpRequestService: HttpRequestService,
    private dialog: MatDialog,
  ) {}

  async ngOnInit() {
    try {
      this.esGuia = this.userRepresentation.rut === this.tema.rut_guia;
      await this.fetchProfesores();
      this.dataSource = new MatTableDataSource<profesor>(this.profesores);
    } catch (error) {
      console.error('Error fetching profesores');
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

  async fetchProfesores() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getProfesores(this.tema.nombre_escuela).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.profesores = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching profesores');
            reject(error);
          }
        )
      });
    });
  }

}
