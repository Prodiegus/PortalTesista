import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {MenuAdminComponent} from '../menu-admin/menu-admin.component';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss']
})
export class HomeHeaderComponent {
  @Input() userRepresentation: any;

  constructor(private router: Router) { }

  goHome() {
    this.router.navigate(['/home']);
  }

  protected readonly menubar = menubar;

  menu() {
    alert('menu no completo');
  }

  protected readonly MenuAdminComponent = MenuAdminComponent;
}
