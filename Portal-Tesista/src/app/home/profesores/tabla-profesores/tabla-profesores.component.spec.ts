import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablaProfesoresComponent } from './tabla-profesores.component';
import { Router } from '@angular/router';
import { CONST } from '../../../common/const/const';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('TablaProfesoresComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: TablaProfesoresComponent;
  let fixture: ComponentFixture<TablaProfesoresComponent>;
  let mockUserService: any;
  let mockHttpRequestService: any;
  let mockDialog: any;

  const profesorMock = {
    id: 1,
    nombre: 'Juan Perez',
    rut: '12345678-9',
    correo: 'juan@prueba.cl',
    tipo: 'cargo',
    escuela: 'Escuela 1',
    activo: true,
    cambiarRol: false
  };

  beforeEach(async () => {
    mockUserService = {
      getUser: jasmine.createSpy('getUser').and.returnValue(CONST.userRepresentation)
    };
    mockHttpRequestService = {
      getProfesores: jasmine.createSpy('getProfesores').and.returnValue(Promise.resolve(of([profesorMock]))),
      desactivarDocente: jasmine.createSpy('desactivarDocente').and.returnValue(Promise.resolve(of({ estado: 'Usuario desactivado' }))),
      activarDocente: jasmine.createSpy('activarDocente').and.returnValue(Promise.resolve(of({ estado: 'Usuario activado' }))),
      editarUsuario: jasmine.createSpy('editarUsuario').and.returnValue(Promise.resolve(of({})))
    };
    mockDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(true)
      })
    };

    await TestBed.configureTestingModule({
      declarations: [TablaProfesoresComponent],
      providers: [
        { provide: Router, useValue: {
            getCurrentNavigation: () => ({
              extras: { state: { userRepresentation: CONST.userRepresentation } }
            }),
            navigate: jasmine.createSpy('navigate')
          }
        },
        { provide: 'UserService', useValue: mockUserService },
        { provide: 'HttpRequestService', useValue: mockHttpRequestService },
        { provide: MatDialog, useValue: mockDialog }
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TablaProfesoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should fetch profesores on ngOnInit', async () => {
    spyOn(component, 'fetchProfesores').and.callThrough();
    await component.ngOnInit();
    expect(mockUserService.getUser).toHaveBeenCalled();
    expect(mockHttpRequestService.getProfesores).toHaveBeenCalled();
    expect((component as any).profesores.length).toBe(1);
    expect((component as any).loading).toBeFalse();
  });

  it('should set showAgregarDocente to true on agregarProfesor', () => {
    component.showAgregarDocente = false;
    component.agregarProfesor();
    expect(component.showAgregarDocente).toBeTrue();
  });

  it('should toggle cambiarRol property', () => {
    const prof = { ...profesorMock, cambiarRol: false };
    component.toogleCambiarRol(prof);
    expect(prof.cambiarRol).toBeTrue();
    component.toogleCambiarRol(prof);
    expect(prof.cambiarRol).toBeFalse();
  });

  it('should call actualizarUsuario and fetchProfesores on cambiarRol', async () => {
    spyOn(component, 'actualizarUsuario').and.returnValue(Promise.resolve());
    spyOn(component, 'fetchProfesores').and.returnValue(Promise.resolve());
    await component.cambiarRol(profesorMock);
    expect(component.actualizarUsuario).toHaveBeenCalled();
    expect(component.fetchProfesores).toHaveBeenCalled();
  });

  it('should fetch profesores and set loading on closeAgregarDocente', async () => {
    spyOn(component, 'fetchProfesores').and.returnValue(Promise.resolve());
    component.showAgregarDocente = true;
    await component.closeAgregarDocente();
    expect(component.showAgregarDocente).toBeFalse();
    expect(component.fetchProfesores).toHaveBeenCalled();
    expect((component as any).loading).toBeFalse();
  });

  xit('should call fetchProfesores and set loading on activar', async () => {
    spyOn(component, 'fetchProfesores').and.returnValue(Promise.resolve());
    await component.activar(profesorMock);
    expect(mockHttpRequestService.activarDocente).toHaveBeenCalled();
    expect(component.fetchProfesores).toHaveBeenCalled();
    expect((component as any).loading).toBeFalse();
  });

  xit('should call fetchProfesores and set loading on desactivar', async () => {
    spyOn(component, 'fetchProfesores').and.returnValue(Promise.resolve());
    await component.desactivar(profesorMock);
    expect(mockHttpRequestService.desactivarDocente).toHaveBeenCalled();
    expect(component.fetchProfesores).toHaveBeenCalled();
    expect((component as any).loading).toBeFalse();
  });
});
