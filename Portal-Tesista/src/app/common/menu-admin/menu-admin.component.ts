import {Component, HostListener, ElementRef, Input} from '@angular/core';
import {Router} from '@angular/router';
import {KeycloakService} from '../../keycloak/keycloak.service';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.scss']
})
export class MenuAdminComponent {
  protected isVisible = false;

  @Input() userRepresentation!: any;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private keycloakService: KeycloakService
  ) {}

  openMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isVisible = true;
  }

  closeMenu() {
    this.isVisible = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeMenu();
    }
  }

  goHome() {
    this.isVisible = false;
    this.router.navigate(['/home']);
  }

  goToProfesores() {
    this.isVisible = false;
    this.router.navigate(['/home/profesores']);
  }

  goToEscuelas() {
    this.isVisible = false;
    this.router.navigate(['/home/escuelas']);
  }

  async logout() {
    await this.keycloakService.logout({ redirectUri: window.location.origin });
  }

  goToFlujoGeneral() {
    this.isVisible = false;
    this.router.navigate(['/home/flujo-general']);
  }

  goToRevision() {
    this.isVisible = false;
    this.router.navigate(['/home/revision']);
  }

  goToForms() {
    this.isVisible = false;
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdNym4QDvCIo0HEGiB5o-PrnnogffGSxEZNNkYNgqF3pYtjyQ/viewform?usp=header', '_blank');
  }
}
