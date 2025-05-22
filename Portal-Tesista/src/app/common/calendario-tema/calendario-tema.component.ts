import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { HttpRequestService } from '../Http-request.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

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
  eventos: any = [];

  constructor(
    private httpRequestService: HttpRequestService,
    private dialog: MatDialog,
  ) {}

  async ngOnInit() {
    this.loading = true;
    this.currentDate = new Date();
    this.mes = this.currentDate.getMonth();
    this.year = this.currentDate.getFullYear();
    this.calendario = this.getCalendarDays(this.year, this.mes);
    try {
      await this.getEventos();
    } catch (error) {
      console.error('Error obteniendo reuniones:', error);
    } finally {
      this.loading = false;
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

  onMouseEnter(weekIndex: number, dayIndex: number, dia: number | null): void {
    if(this.userRepresentation.tipo === "alumno" || this.tema.estado === "Finalizado") {
      this.hoveredCell = { weekIndex, dayIndex };
    } else if (this.hayEvento(dia)) {
      this.hoveredCell = { weekIndex, dayIndex };
    }
  }

  onMouseLeave(): void {
    this.hoveredCell = null;
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  showEventos(dia: number | null) {
    if (!dia || isNaN(this.year) || isNaN(this.mes)) return; // Validate inputs
    const eventos = this.getEventosDia(dia);
    if (eventos.length > 0) {
      let htmlContent = `<ul>` + eventos.map((evento: any) => {
        return `<li><strong>${evento.titulo}: </strong> ${evento.contenido}</li>`;
      }).join('') + `</ul>`; // Combina el contenido HTML en una lista

      if (eventos.length === 1) {
        htmlContent = `<div><strong>${eventos[0].titulo}: </strong>${eventos[0].contenido}</div>`; // Si solo hay un evento, muestra el contenido directamente
      }

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Eventos',
          message: htmlContent,
          isAlert: true,
        },
      });

      // Usa `afterOpened` para establecer el contenido HTML
      dialogRef.afterOpened().subscribe(() => {
        const dialogContent = document.querySelector('mat-dialog-content');
        if (dialogContent) {
          dialogContent.innerHTML = htmlContent; // Inserta el contenido HTML
        }
      });

      return;
    } else {
      console.log('No hay eventos para este día');
      return;
    }
  }

  getEventosDia(dia: number | null): any[] {
    if (dia === null || isNaN(this.year) || isNaN(this.mes)) return []; // Validate inputs
    try {
      const fechaDia = new Date(this.year, this.mes, dia);
      if (isNaN(fechaDia.getTime())) throw new Error('Invalid date'); // Validate fechaDia
      const formattedFechaDia = fechaDia.toISOString().slice(0, 10); // Format the target date
      return this.eventos.filter((evento: any) => {
        if (!evento.fecha) return false; // Ensure evento.fecha exists
        const eventoFecha = new Date(evento.fecha);
        if (isNaN(eventoFecha.getTime())) return false; // Validate eventoFecha
        return eventoFecha.toISOString().slice(0, 10) === formattedFechaDia; // Compare dates
      });
    } catch (error) {
      console.error('Error parsing date:', error);
      return []; // Return an empty array if date parsing fails
    }
  }
  hayEvento(dia: number | null): boolean {
    if (dia === null || typeof this.year !== 'number' || typeof this.mes !== 'number') return false; // Validate inputs
    try {
      const fechaDia = new Date(this.year, this.mes, dia);
      if (isNaN(fechaDia.getTime())) throw new Error('Invalid date'); // Check if the date is valid
      const formattedFechaDia = fechaDia.toISOString().slice(0, 10); // Format the target date
      return this.eventos.some((evento: any) => {
        if (!evento.fecha) return false; // Ensure evento.fecha exists
        const eventoFecha = new Date(evento.fecha);
        if (isNaN(eventoFecha.getTime())) throw new Error('Invalid event date'); // Validate event date
        return eventoFecha.toISOString().slice(0, 10) === formattedFechaDia; // Compare dates
      });
    } catch (error) {
      console.error('Error parsing date:', error);
      return false; // Return false if date parsing fails
    }
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
            this.getEventos();
            this.loading = false;
          });
        };
        reader.readAsDataURL(file);
      } else {
        console.error('Solo se acepta PDF.');
      }
    }
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
