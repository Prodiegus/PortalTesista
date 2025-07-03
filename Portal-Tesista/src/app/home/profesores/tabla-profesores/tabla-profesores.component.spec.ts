import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TablaProfesoresComponent } from './tabla-profesores.component';
import { UserService } from '../../../common/user.service';
import { HttpRequestService } from '../../../common/Http-request.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ConfirmDialogComponent } from '../../../common/confirm-dialog/confirm-dialog.component';

describe('TablaProfesoresComponent', () => {
  let component: TablaProfesoresComponent;
  let fixture: ComponentFixture<TablaProfesoresComponent>;
  let userSpy: jasmine.SpyObj<UserService>;
  let httpSpy: jasmine.SpyObj<HttpRequestService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const profesorMock = {
    id: 1,
    nombre: 'Juan Perez',
    rut: '1234',
    correo: 'juan@x.cl',
    tipo: 'cargo',
    escuela: 'E1',
    activo: true,
    cambiarRol: false
  };

  beforeEach(async () => {
    userSpy = jasmine.createSpyObj('UserService', ['getUser']);
    httpSpy = jasmine.createSpyObj('HttpRequestService', [
      'getProfesores',
      'desactivarDocente',
      'activarDocente',
      'editarUsuario'
    ]);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    // Comportamiento por defecto (flujo feliz)
    userSpy.getUser.and.returnValue({ escuela: 'E1' });
    httpSpy.getProfesores.and.returnValue(Promise.resolve(of([ { ...profesorMock } ])));
    httpSpy.desactivarDocente.and.returnValue(Promise.resolve(of({ estado: 'Usuario desactivado' })));
    httpSpy.activarDocente.and.returnValue(Promise.resolve(of({ estado: 'Usuario activado' })));
    httpSpy.editarUsuario.and.returnValue(Promise.resolve(of({})));

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true)
    } as any);

    await TestBed.configureTestingModule({
      declarations: [TablaProfesoresComponent],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: HttpRequestService, useValue: httpSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TablaProfesoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit / fetchProfesores (flujo feliz)', () => {
    it('carga profesores y apaga loading', fakeAsync(() => {
      component.ngOnInit();
      // avanza microtasks: primero el then() del getProfesores, luego el subscribe()
      tick();
      tick();
      expect(userSpy.getUser).toHaveBeenCalled();
      expect(httpSpy.getProfesores).toHaveBeenCalledWith('E1');
      expect((component as any).profesores.length).toBe(1);
      expect(component['loading']).toBeFalse();
    }));
  });

  xdescribe('ngOnInit / fetchProfesores (error)', () => {
    it('registra error y apaga loading sin propagar excepción', async () => {
      // forzamos reject del promise
      httpSpy.getProfesores.and.returnValue(Promise.reject(new Error('fail')));
      const consoleSpy = spyOn(console, 'error');
      await component.ngOnInit();
      // debe haber sido capturado por el catch interno
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching profesores: ', jasmine.any(Error));
      expect(component['loading']).toBeFalse();
    });
  });

  it('agregarProfesor() pone showAgregarDocente=true', () => {
    component.showAgregarDocente = false;
    component.agregarProfesor();
    expect(component.showAgregarDocente).toBeTrue();
  });

  it('toogleCambiarRol() invierte cambiarRol', () => {
    const p = { ...profesorMock, cambiarRol: false };
    component.toogleCambiarRol(p);
    expect(p.cambiarRol).toBeTrue();
    component.toogleCambiarRol(p);
    expect(p.cambiarRol).toBeFalse();
  });

  it('closeAgregarDocente() oculta form y recarga', fakeAsync(() => {
    spyOn(component, 'fetchProfesores').and.returnValue(Promise.resolve());
    component.showAgregarDocente = true;
    component.closeAgregarDocente();
    tick();
    expect(component.showAgregarDocente).toBeFalse();
    expect(component['loading']).toBeFalse();
  }));

  describe('activar()', () => {
    it('flujo feliz: llama activarDocente, recarga y apaga loading', fakeAsync(() => {
      spyOn(component, 'fetchProfesores').and.returnValue(Promise.resolve());
      component.activar(profesorMock);
      tick(); // afterClosed()
      tick(); // subscribe()
      expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, jasmine.any(Object));
      expect(httpSpy.activarDocente).toHaveBeenCalled();
      expect(component['loading']).toBeFalse();
    }));

    it('si dialog devuelve false no hace nada y loading permanece true hasta ngOnInit', fakeAsync(() => {
      dialogSpy.open.and.returnValue({ afterClosed: () => of(false) } as any);
      spyOn(component, 'fetchProfesores');
      component.activar(profesorMock);
      tick();
      expect(httpSpy.activarDocente).not.toHaveBeenCalled();
      expect(component['loading']).toBeTrue();
    }));
  });

  describe('desactivar()', () => {
    it('flujo feliz: llama desactivarDocente, recarga y apaga loading', fakeAsync(() => {
      spyOn(component, 'fetchProfesores').and.returnValue(Promise.resolve());
      component.desactivar(profesorMock);
      tick();
      tick();
      expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, jasmine.any(Object));
      expect(httpSpy.desactivarDocente).toHaveBeenCalled();
      expect(component['loading']).toBeFalse();
    }));

    it('si dialog devuelve false no hace nada y loading permanece true', fakeAsync(() => {
      dialogSpy.open.and.returnValue({ afterClosed: () => of(false) } as any);
      spyOn(component, 'fetchProfesores');
      component.desactivar(profesorMock);
      tick();
      expect(httpSpy.desactivarDocente).not.toHaveBeenCalled();
      expect(component['loading']).toBeTrue();
    }));
  });

  it('actualizarUsuario() resuelve y rechaza correctamente', fakeAsync(() => {
    // Éxito
    httpSpy.editarUsuario.and.returnValue(Promise.resolve(of({})));
    let ok = false;
    component.actualizarUsuario({}).then(() => ok = true);
    tick();
    expect(ok).toBeTrue();

    // Error
    httpSpy.editarUsuario.and.returnValue(Promise.resolve(throwError(() => 'err')));
    let fail = false;
    component.actualizarUsuario({}).catch(() => fail = true);
    tick();
    expect(fail).toBeTrue();
  }));

  it('cambiarRol() llama actualizarUsuario y fetchProfesores cuando dialog=true', fakeAsync(() => {
    const spyActualizar = spyOn(component, 'actualizarUsuario').and.returnValue(Promise.resolve());
    const spyFetch = spyOn(component, 'fetchProfesores').and.returnValue(Promise.resolve());
    component.cambiarRol(profesorMock);
    tick(); // afterClosed
    tick(); // actualizarUsuario()
    tick(); // fetchProfesores()
    expect(spyActualizar).toHaveBeenCalled();
    expect(spyFetch).toHaveBeenCalled();
    expect(component['loading']).toBeFalse();
  }));
});
