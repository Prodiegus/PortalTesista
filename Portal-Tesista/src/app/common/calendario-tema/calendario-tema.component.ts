import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-calendario-tema',
  templateUrl: './calendario-tema.component.html',
  styleUrl: './calendario-tema.component.scss'
})
export class CalendarioTemaComponent implements OnInit {
  @Input() userRepresentation!: any;
  @Input() tema!: any;

  hoveredCell: { weekIndex: number; dayIndex: number } | null = null;

  loading = false;

  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  calendario: (number | null)[][] = [];
  currentDate: Date = new Date();
  mes: number = 0;
  year: number = 0;

  ngOnInit() {
    this.loading = true;
    this.currentDate = new Date();
    this.mes = this.currentDate.getMonth();
    this.year = this.currentDate.getFullYear();
    this.calendario = this.getCalendarDays(this.year, this.mes);
    setTimeout(() => {
      this.loading = false;
    }, 1000);
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

    while (calendarDays.length < 35) {
      calendarDays.push(null);
    }

    const calendarMatrix: (number | null)[][] = [];
    for (let i = 0; i < 35; i += 7) {
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
    this.hoveredCell = { weekIndex, dayIndex };
  }

  onMouseLeave(): void {
    this.hoveredCell = null;
  }

}
