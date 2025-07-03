import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditarDetalleComponent } from './editar-detalle.component';
import { HttpRequestService } from '../../Http-request.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('EditarDetalleComponent', () => {
  let component: EditarDetalleComponent;
  let fixture: ComponentFixture<EditarDetalleComponent>;
  let httpSpy: jasmine.SpyObj<HttpRequestService>;

  const temaMock: any = {
    id: 10,
    titulo: 'T1',
    resumen: 'R1',
    estado: 'E1',
    nombre_escuela: 'Esc1',
    guia: 'G1',
    rut_guia: 'RG1',
    numero_fase: 2
  };

  beforeEach(async () => {
    httpSpy = jasmine.createSpyObj('HttpRequestService', ['editTema', 'cambiarEstadoTema']);

    await TestBed.configureTestingModule({
      declarations: [EditarDetalleComponent],
      imports: [FormsModule],
      providers: [{ provide: HttpRequestService, useValue: httpSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarDetalleComponent);
    component = fixture.componentInstance;
    component.userRepresentation = { tipo: 'guia' };
    component.tema = temaMock;
    fixture.detectChanges();
  });

  it('should create and init original data', () => {
    expect(component).toBeTruthy();
    // ngOnInit run by detectChanges
    expect((component as any).esGuia).toBeTrue();
    // originalData and form reset
    expect((component as any).titulo).toBe('T1');
    expect((component as any).estado).toBe('E1');
    expect((component as any).resumen).toBe('R1');
    expect((component as any).escuelas).toEqual(['Esc1']);
    expect((component as any).profesores).toEqual(['G1']);
  });

  it('should reset form on onCancel', () => {
    // change fields
    (component as any).titulo = 'X';
    component.onCancel();
    expect((component as any).titulo).toBe('T1');
  });

  describe('onSubmit flows', () => {
    it('should call editarTema when estado unchanged', fakeAsync(async () => {
      spyOn(component, 'editarTema').and.returnValue(Promise.resolve());
      (component as any).originalData = { estado: 'E1' };
      (component as any).estado = 'E1';
      (component as any).resumen = 'New';

      component.onSubmit();
      tick();

      expect(component['editarTema']).toHaveBeenCalled();
      expect(component['guardando']).toBeFalse();
    }));

    it('should call cambiarEstado when estado changed', fakeAsync(async () => {
      spyOn(component, 'cambiarEstado').and.returnValue(Promise.resolve());
      (component as any).originalData = { estado: 'E1' };
      (component as any).estado = 'E2';

      component.onSubmit();
      tick();

      expect(component['cambiarEstado']).toHaveBeenCalledWith('E2');
      expect(component['guardando']).toBeFalse();
    }));

    it('should handle error in editarTema', fakeAsync(async () => {
      spyOn(component, 'editarTema').and.returnValue(Promise.reject(new Error('fail')));
      spyOn(console, 'error');
      (component as any).originalData = { estado: 'E1' };
      (component as any).estado = 'E1';

      component.onSubmit();
      tick();

      expect(console.error).toHaveBeenCalledWith('Error al editar tema');
      expect(component['guardando']).toBeFalse();
    }));

    it('should handle error in cambiarEstado', fakeAsync(async () => {
      spyOn(component, 'cambiarEstado').and.returnValue(Promise.reject(new Error('err')));
      spyOn(console, 'error');
      (component as any).originalData = { estado: 'E1' };
      (component as any).estado = 'E2';

      component.onSubmit();
      tick();

      expect(console.error).toHaveBeenCalledWith('Error al editar tema');
      expect(component['guardando']).toBeFalse();
    }));
  });

  describe('editarTema and cambiarEstado', () => {
    it('editarTema success', fakeAsync(async () => {
      httpSpy.editTema.and.returnValue(Promise.resolve(of({ ok: true } as any)));
      await component.editarTema();
      tick();
      expect((component as any).editResponse).toEqual({ ok: true });
    }));

    it('editarTema error', fakeAsync(async () => {
      httpSpy.editTema.and.returnValue(Promise.resolve(throwError(() => new Error('e'))));
      spyOn(console, 'error');
      component.editarTema().catch(() => {});
      tick();
      expect(console.error).toHaveBeenCalledWith('Error editing tema');
    }));

    it('cambiarEstado success', fakeAsync(async () => {
      httpSpy.cambiarEstadoTema.and.returnValue(Promise.resolve(of({ st: 'ok' } as any)));
      await component.cambiarEstado('E3');
      tick();
      expect((component as any).editResponse).toEqual({ st: 'ok' });
    }));

    it('cambiarEstado error', fakeAsync(async () => {
      httpSpy.cambiarEstadoTema.and.returnValue(Promise.resolve(throwError(() => new Error('err'))));
      spyOn(console, 'error');
      component.cambiarEstado('X').catch(() => {});
      tick();
      expect(console.error).toHaveBeenCalledWith('Error changing tema status');
    }));
  });

});
