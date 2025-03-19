import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edicion-tema',
  templateUrl: './edicion-tema.component.html',
  styleUrl: './edicion-tema.component.scss'
})
export class EdicionTemaComponent implements OnInit{
  protected userRepresentation: any;
  protected tema: any;

  loading = false;

  constructor(
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation?.extras?.state) {
      this.userRepresentation = navigation.extras.state['userRepresentation'];
      this.tema = navigation.extras.state['tema'];
    }
  }

  ngOnInit() {
    if (!this.userRepresentation || !this.tema) {
      this.router.navigate(['/home']);
    }
  }

}
