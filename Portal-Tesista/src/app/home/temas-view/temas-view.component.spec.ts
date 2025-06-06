import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { TemasViewComponent } from './temas-view.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../common/user.service';
import { HttpRequestService } from '../../common/Http-request.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CONST } from '../../common/const/const';

const mockUserRepresentation = CONST.userRepresentation;
const mockTemas = CONST.temas;

describe('TemasViewComponent', () => {
  let component: TemasViewComponent;
  let fixture: ComponentFixture<TemasViewComponent>;
  let router: Router;
  let httpRequestService: HttpRequestService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TemasViewComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        UserService,
        HttpRequestService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemasViewComponent);
    component = fixture.componentInstance;
    component.userRepresentation = mockUserRepresentation;

    // Obtener servicios
    router = TestBed.inject(Router);
    httpRequestService = TestBed.inject(HttpRequestService);

    // Mockear servicio HTTP
    spyOn(httpRequestService, 'getTemasUsuario').and.returnValue(
      Promise.resolve(of(mockTemas))
    );

    // Inicializar componente
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch temas on initialization', fakeAsync(() => {
    // Disparar ngOnInit
    component.ngOnInit();
    tick();

    expect(httpRequestService.getTemasUsuario).toHaveBeenCalledWith(mockUserRepresentation.rut);

    // Acceso correcto a propiedad protegida
    expect((component as any).temas).toEqual(mockTemas);
    expect(component.loading).toBeFalse();
  }));

  xit('should navigate to tema detail if only one tema and user is alumno', fakeAsync(() => {
    // Configurar como alumno con un solo tema
    component.userRepresentation.tipo = 'alumno';
    spyOn(httpRequestService, 'getTemasUsuario').and.returnValue(
      Promise.resolve(of([mockTemas[0]]))
    );

    // Espiar navegación
    spyOn(router, 'navigate');

    component.ngOnInit();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/home/tema', 1], {
      state: {
        tema: mockTemas[0],
        userRepresentation: component.userRepresentation
      }
    });
  }));

  it('should not navigate if multiple temas for alumno', fakeAsync(() => {
    // Configurar como alumno con múltiples temas
    component.userRepresentation.tipo = 'alumno';
    spyOn(router, 'navigate');

    component.ngOnInit();
    tick();

    expect(router.navigate).not.toHaveBeenCalled();
  }));

  // Corrección de sintaxis en esta prueba
  xit('should handle error when fetching temas', fakeAsync(() => {
    // Mockear error
    spyOn(console, 'error');
    spyOn(httpRequestService, 'getTemasUsuario').and.returnValue(
      Promise.resolve(throwError(() => new Error('Test error')))
    );

    component.ngOnInit();
    tick();

    expect(console.error).toHaveBeenCalledWith('Error fetching temas');
    expect(component.loading).toBeFalse();
  }));

  it('should show agregarTema form', () => {
    component.showAgregarTema();
    expect(component.agregarTema).toBeTrue();
  });

  it('should navigate to tema detail', () => {
    spyOn(router, 'navigate');

    const tema = mockTemas[1];
    component.detalleTema(tema);

    expect(router.navigate).toHaveBeenCalledWith(['/home/tema', 2], {
      state: {
        tema: tema,
        userRepresentation: component.userRepresentation
      }
    });
  });

  it('should close add tema and refresh list', fakeAsync(() => {
    // Simular que estamos en modo agregar tema
    component.agregarTema = true;

    component.closeAddTema();

    expect(component.agregarTema).toBeFalse();
    expect(component.loading).toBeTrue();

    tick(); // Esperar a que se complete fetchTemas

    expect(component.loading).toBeFalse();

    // Acceso correcto a propiedad protegida
    expect((component as any).temas).toEqual(mockTemas);
  }));

  xit('should display loading spinner while fetching data', () => {
    component.loading = true;
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  xit('should display temas in cards', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.tema-card');
    expect(cards.length).toBe(mockTemas.length);

    // Verificar que se muestra el título del primer tema
    expect(cards[0].textContent).toContain(mockTemas[0].tema);
  }));
});
