import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tema-summary',
  templateUrl: './tema-summary.component.html',
  styleUrl: './tema-summary.component.scss'
})
export class TemaSummaryComponent implements OnInit {
  @Input() tema: any;
  @Input() userRepresentation: any;

  edicion: boolean = false;
  loading: boolean = false;

  avance: number = 70;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.avance = 70;
    console.log(this.avance);
  }

  edicionTema() {
    this.router.navigate(['/home/editar-tema', this.tema.id], {
      state: {
        tema: this.tema,
        userRepresentation: this.userRepresentation
      }
    });
  }

}
