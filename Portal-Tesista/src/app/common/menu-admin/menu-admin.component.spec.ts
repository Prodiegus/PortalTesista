import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuAdminComponent } from './menu-admin.component';
import { Router } from '@angular/router';
import { CONST } from '../const/const';

describe('MenuAdminComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: MenuAdminComponent;
  let fixture: ComponentFixture<MenuAdminComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuAdminComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuAdminComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    component.userRepresentation = CONST.userRepresentation;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /home when goHome is called', () => {
    component.goHome();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to /home/profesores when goToProfesores is called', () => {
    component.goToProfesores();
    expect(router.navigate).toHaveBeenCalledWith(['/home/profesores']);
  });

  it('should navigate to /home/escuelas when goToEscuelas is called', () => {
    component.goToEscuelas();
    expect(router.navigate).toHaveBeenCalledWith(['/home/escuelas']);
  });

  it('should navigate to /home/flujo-general when goToFlujoGeneral is called', () => {
    component.goToFlujoGeneral();
    expect(router.navigate).toHaveBeenCalledWith(['/home/flujo-general']);
  });

  it('should navigate to /home/revision when goToRevision is called', () => {
    component.goToRevision();
    expect(router.navigate).toHaveBeenCalledWith(['/home/revision']);
  });
});

