import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuAdminComponent } from './menu-admin.component';
import { Router } from '@angular/router';
import { ElementRef } from '@angular/core';
import { KeycloakService } from '../../keycloak/keycloak.service';

describe('MenuAdminComponent', () => {
  let component: MenuAdminComponent;
  let fixture: ComponentFixture<MenuAdminComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let keycloakSpy: jasmine.SpyObj<KeycloakService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    keycloakSpy = jasmine.createSpyObj('KeycloakService', ['logout']);

    await TestBed.configureTestingModule({
      declarations: [MenuAdminComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: KeycloakService, useValue: keycloakSpy },
        {
          provide: ElementRef,
          useValue: {
            nativeElement: {
              contains: () => false // Mock inicial
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuAdminComponent);
    component = fixture.componentInstance;
    
    // Simula la entrada @Input()
    component.userRepresentation = { 
      username: 'test-user', 
      email: 'test@example.com' 
    };
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should accept @Input() userRepresentation', () => {
    expect(component.userRepresentation).toEqual({
      username: 'test-user',
      email: 'test@example.com'
    });
  });

  it('should navigate to /home when goHome is called', () => {
    component.goHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    expect(component['isVisible']).toBeFalse();
  });

  it('should navigate to /home/profesores when goToProfesores is called', () => {
    component.goToProfesores();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home/profesores']);
    expect(component['isVisible']).toBeFalse();
  });

  it('should navigate to /home/escuelas when goToEscuelas is called', () => {
    component.goToEscuelas();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home/escuelas']);
    expect(component['isVisible']).toBeFalse();
  });

  it('should navigate to /home/flujo-general when goToFlujoGeneral is called', () => {
    component.goToFlujoGeneral();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home/flujo-general']);
    expect(component['isVisible']).toBeFalse();
  });

  it('should navigate to /home/revision when goToRevision is called', () => {
    component.goToRevision();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home/revision']);
    expect(component['isVisible']).toBeFalse();
  });

  it('should open the menu when openMenu is called', () => {
    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');
    component.openMenu(event);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component['isVisible']).toBeTrue();
  });

  it('should close the menu when closeMenu is called', () => {
    component['isVisible'] = true;
    component.closeMenu();
    expect(component['isVisible']).toBeFalse();
  });

  it('should close the menu when document click is outside the component', () => {
    const event = new MouseEvent('click');
    spyOn(component['elementRef'].nativeElement, 'contains').and.returnValue(false);
    component['isVisible'] = true;
    component.onDocumentClick(event);
    expect(component['isVisible']).toBeFalse();
  });

  it('should not close the menu when document click is inside the component', () => {
    const event = new MouseEvent('click');
    spyOn(component['elementRef'].nativeElement, 'contains').and.returnValue(true);
    component['isVisible'] = true;
    component.onDocumentClick(event);
    expect(component['isVisible']).toBeTrue();
  });

  it('should call keycloakService.logout on logout()', async () => {
    keycloakSpy.logout.and.resolveTo(); // Simula promesa resuelta
    await component.logout();
    expect(keycloakSpy.logout).toHaveBeenCalledWith({ redirectUri: window.location.origin });
  });

  it('should open Google Form when goToForms is called', () => {
    const spy = spyOn(window, 'open');
    component.goToForms();
    expect(spy).toHaveBeenCalledWith(
      'https://docs.google.com/forms/d/e/1FAIpQLSdNym4QDvCIo0HEGiB5o-PrnnogffGSxEZNNkYNgqF3pYtjyQ/viewform?usp=header',
      '_blank'
    );
    expect(component['isVisible']).toBeFalse();
  });
});