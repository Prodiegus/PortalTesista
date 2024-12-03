import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-tabla-profesores',
  templateUrl: './tabla-profesores.component.html',
  styleUrl: './tabla-profesores.component.scss'
})
export class TablaProfesoresComponent {
  @Input() profesores: any;

}
