import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { HttpRequestService } from '../Http-request.service';

@Component({
  selector: 'app-calendario-tema',
  templateUrl: './calendario-tema.component.html',
  styleUrl: './calendario-tema.component.scss'
})
export class CalendarioTemaComponent implements OnInit {
  @Input() userRepresentation!: any;
  @Input() tema!: any;

  @ViewChild('fileInput') fileInput!: ElementRef;

  hoveredCell: { weekIndex: number; dayIndex: number } | null = null;

  loading = false;

  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  calendario: (number | null)[][] = [];
  currentDate: Date = new Date();
  mes: number = 0;
  year: number = 0;
  reuniones: any = [];
  eventos: any = [];

  constructor(
    private httpRequestService: HttpRequestService,
  ) {}

  async ngOnInit() {
    this.loading = true;
    this.currentDate = new Date();
    this.mes = this.currentDate.getMonth();
    this.year = this.currentDate.getFullYear();
    this.calendario = this.getCalendarDays(this.year, this.mes);
    try {
      await this.getReuniones();
      await this.getEventos();
    } catch (error) {
      console.error('Error obteniendo reuniones:', error);
    } finally {
      this.loading = false;
      console.log('eventos: '+this.eventos);
    }
  }

  getCalendarDays(year: number, month: number): (number | null)[][] {
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the month
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // Day of the week for the 1st day (0 = Sunday, 6 = Saturday)

    const calendarDays: (number | null)[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    while (calendarDays.length < 36) {
      calendarDays.push(null);
    }

    const calendarMatrix: (number | null)[][] = [];
    for (let i = 1; i < 36; i += 7) {
      calendarMatrix.push(calendarDays.slice(i, i + 7));
    }

    return calendarMatrix;
  }

  mesAnterior() {
    this.mes--;
    if (this.mes < 0) {
      this.mes = 11;
      this.year--;
    }
    this.calendario = this.getCalendarDays(this.year, this.mes);
  }

  mesSiguiente() {
    this.mes++;
    if (this.mes > 11) {
      this.mes = 0;
      this.year++;
    }
    this.calendario = this.getCalendarDays(this.year, this.mes);
  }

  onMouseEnter(weekIndex: number, dayIndex: number): void {
    if(this.userRepresentation.tipo === "alumno"){
      this.hoveredCell = { weekIndex, dayIndex };
    }
  }

  onMouseLeave(): void {
    this.hoveredCell = null;
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  hayEvento(dia: number | null): boolean {
    if (!dia) return false; // Si el día es nulo, no hay reunión
    const fechaDia = new Date(this.year, this.mes, dia).toISOString().slice(0, 10);
    return this.eventos.some((evento: any) => evento.fecha === fechaDia);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = (reader.result as string).split(',')[1]; // Remove the Data URL prefix
          const formattedDate = this.currentDate.toISOString().slice(0, 19).replace('T', ' ');
          const formData = {
            id_tema: this.tema.id,
            nombre_archivo: file.name,
            archivo64: fileContent,
            fecha: formattedDate,
          };
          this.loading = true;
          this.subirAvance(formData).then(() => {
            this.loading = false;
          });
        };
        reader.readAsDataURL(file);
      } else {
        console.error('Solo se acepta PDF.');
      }
    }
  }

  async getReuniones(){
    return new Promise<any>((resolve, reject) => {
      this.httpRequestService.getReuniones(this.tema.id).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.reuniones = data;
            resolve(data);
          },
          (error: any) => {
            console.error('Error obteniendo reuniones');
            reject(error);
          }
        );
      });
    });
  }

  async getEventos() {
    return new Promise<any>((resolve, reject) => {
      this.httpRequestService.getEventos(this.tema.id).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.eventos = data;
            resolve(data);
          },
          (error: any) => {
            console.error('Error obteniendo eventos');
            reject(error);
          }
        );
      });
    });
  }

  async subirAvance(avance: any) {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.subirAvance(avance).then(observable => {
        observable.subscribe(
          (data: any) => {
            resolve();
          },
          (error: any) => {
            console.error('Error subiendo avance');
            reject(error);
          }
        );
      });
    });
  }
}
