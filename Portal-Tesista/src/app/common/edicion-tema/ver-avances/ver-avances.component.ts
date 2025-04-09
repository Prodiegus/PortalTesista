import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-ver-avances',
  templateUrl: './ver-avances.component.html',
  styleUrl: './ver-avances.component.scss'
})
export class VerAvancesComponent implements OnInit{
  @Input() tema!: any;
  @Input() userRepresentation!: any;

  loading: boolean = false;

  ngOnInit() {
  }

}
