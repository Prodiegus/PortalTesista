import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VerReunionesComponent, Reunion } from './ver-reuniones.component';
import { HttpRequestService } from '../../Http-request.service';
import { of, throwError, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

describe('VerReunionesComponent', () => {
  let component: VerReunionesComponent;
  let fixture: ComponentFixture<VerReunionesComponent>;
  let httpSpy: jasmine.SpyObj<HttpRequestService>;

  const rawData = [
    { id: 1, fecha: '2025-01-01T10:00:00.000Z', resumen: 'R1', estado: 'pendiente', rut_coordinador: '111', id_tema: 42 },
    { id: 2, fecha: '2025-01-02T12:00:00.000Z', resumen: 'R2', estado: 'completado', rut_coordinador: '222', id_tema: 42 },
    { id: 3, fecha: '2025-01-03T09:00:00.000Z', resumen: 'R3', estado: 'pendiente', rut_coordinador: '333', id_tema: 42 }
  ];
  const parsed: Reunion[] = [
    { id: 1, fecha: rawData[0].fecha, resumen: 'R1', estado: 'pendiente', rut_coordinador: '111', id_tema: 42 },
    { id: 3, fecha: rawData[2].fecha, resumen: 'R3', estado: 'pendiente', rut_coordinador: '333', id_tema: 42 },
    { id: 2, fecha: rawData[1].fecha, resumen: 'R2', estado: 'completado', rut_coordinador: '222', id_tema: 42 }
  ];

  beforeEach(async () => {
    httpSpy = jasmine.createSpyObj('HttpRequestService', ['getReuniones']);
    await TestBed.configureTestingModule({
      declarations: [VerReunionesComponent],
      providers: [{ provide: HttpRequestService, useValue: httpSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(VerReunionesComponent);
    component = fixture.componentInstance;
    // instalamos un paginator y sort mock
    component.paginator = { firstPage: jasmine.createSpy() } as any as MatPaginator;
    component.sort = {} as MatSort;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('parsearToReuniones & ordenarReuniones', () => {
    it('parsearToReuniones convierte correctamente', () => {
      const output = component.parsearToReuniones(rawData);
      expect(output.length).toBe(3);
      expect(output[0].id).toBe(1);
    });

    it('ordenarReuniones pone pendientes (asc) y completados (desc)', () => {
      const ordered = component.ordenarReuniones([...rawData]);
      // pendientes primero, ascendentes por fecha
      expect(ordered[0].id).toBe(1);
      expect(ordered[1].id).toBe(3);
      // luego completados
      expect(ordered[2].id).toBe(2);
    });
  });

  describe('getReuniones success & error branches', () => {
    beforeEach(() => {
      component.tema = { id: 42 };
    });

    it('getReuniones rechaza si no hay tema.id', fakeAsync(() => {
      component.tema = {};
      let err: any;
      component.getReuniones().catch(e => err = e);
      tick();
      expect(err).toBe('Tema no disponible o sin ID');
    }));

    it('getReuniones rechaza en error de servicio', fakeAsync(() => {
      httpSpy.getReuniones.and.returnValue(Promise.resolve(throwError(() => new Error('fail'))));
      component.tema = { id: 42 };
      let err: any;
      component.getReuniones().catch(e => err = e);
      tick();
      expect(err.message).toBe('fail');
    }));
  });

  describe('hooks de ciclo de vista', () => {
    it('ngAfterViewInit llama assignPaginatorAndSort', () => {
      spyOn<any>(component, 'assignPaginatorAndSort');
      component.ngAfterViewInit();
      expect((component as any).assignPaginatorAndSort).toHaveBeenCalled();
    });
    it('ngAfterViewChecked sólo asigna una vez', () => {
      spyOn<any>(component, 'assignPaginatorAndSort');
      // primera pasada
      component.paginatorInitialized = false;
      component.ngAfterViewChecked();
      expect((component as any).assignPaginatorAndSort).toHaveBeenCalledTimes(1);
      // segunda pasada no vuelve a asignar
      (component as any).assignPaginatorAndSort.calls.reset();
      component.paginatorInitialized = true;
      component.ngAfterViewChecked();
      expect((component as any).assignPaginatorAndSort).not.toHaveBeenCalled();
    });
  });

  describe('crear / editar flujo', () => {
    beforeEach(() => {
      // para no recargar en cerrar...
      spyOn(component, 'getReuniones').and.returnValue(Promise.resolve());
    });

    it('showCrearReunion activa la vista', () => {
      component.crearReunion = false;
      component.showCrearReunion();
      expect(component.crearReunion).toBeTrue();
    });

    it('cerrarCrearReunion desactiva y recarga', fakeAsync(() => {
      component.crearReunion = true;
      component.cerrarCrearReunion();
      tick();
      expect(component.crearReunion).toBeFalse();
      expect(component.getReuniones).toHaveBeenCalled();
    }));

    it('verDetalleReunion abre el formulario de edición', () => {
      const r = { id: 99 } as any;
      component.verDetalleReunion(r);
      expect(component.editarReunion).toBeTrue();
      expect((component as any).reunion).toBe(r);
    });

    it('cerrarEditarReunion cierra y recarga', fakeAsync(() => {
      component.editarReunion = true;
      component.cerrarEditarReunion();
      tick();
      expect(component.editarReunion).toBeFalse();
      expect(component.getReuniones).toHaveBeenCalled();
    }));
  });
});
