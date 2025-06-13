import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarioTemaComponent } from './calendario-tema.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HttpRequestService } from '../Http-request.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

describe('CalendarioTemaComponent', () => {
  let component: CalendarioTemaComponent;
  let fixture: ComponentFixture<CalendarioTemaComponent>;
  let httpSpy: jasmine.SpyObj<HttpRequestService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    httpSpy = jasmine.createSpyObj('HttpRequestService', ['getEventos', 'subirAvance']);
    // defaults to avoid undefined.then errors
    httpSpy.getEventos.and.returnValue(Promise.resolve(of([])));
    httpSpy.subirAvance.and.returnValue(Promise.resolve(of({})));

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [CalendarioTemaComponent],
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: HttpRequestService, useValue: httpSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarioTemaComponent);
    component = fixture.componentInstance;

    // set up a real fileInput for @ViewChild
    fixture.detectChanges();
    component.fileInput = new ElementRef(document.createElement('input'));
    component.userRepresentation = { tipo: 'otro' };
    component.tema = { id: 1, estado: 'En curso' };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('loads calendar and events on success', async () => {
      const ev = [{ fecha: '2025-06-05', titulo: 'E', contenido: 'C' }];
      httpSpy.getEventos.and.returnValue(Promise.resolve(of(ev)));

      await component.ngOnInit();

      expect(component.calendario.length).toBeGreaterThan(0);
      expect(component.eventos).toEqual(ev);
      expect(component.loading).toBeFalse();
    });

    it('handles error from getEventos', async () => {
      httpSpy.getEventos.and.returnValue(Promise.resolve(throwError(() => new Error('fail'))));
      const spy = spyOn(console, 'error');

      await component.ngOnInit();

      expect(spy).toHaveBeenCalledWith('Error obteniendo reuniones:', jasmine.any(Error));
      expect(component.loading).toBeFalse();
    });
  });

  it('getCalendarDays returns correct shape', () => {
    const mat = component.getCalendarDays(2025, 0);
    expect(mat.length).toBeGreaterThanOrEqual(5);
    expect(mat.flat().filter(d => d === null).length).toBeGreaterThan(0);
  });

  it('mesAnterior and mesSiguiente wrap correctly', () => {
    component.mes = 0; component.year = 2025;
    component.mesAnterior();
    expect(component.mes).toBe(11);
    expect(component.year).toBe(2024);

    component.mes = 11; component.year = 2025;
    component.mesSiguiente();
    expect(component.mes).toBe(0);
    expect(component.year).toBe(2026);
  });

  describe('hover logic', () => {
    it('sets hoveredCell for alumno', () => {
      component.userRepresentation.tipo = 'alumno';
      component.onMouseEnter(1, 2, null);
      expect(component.hoveredCell).toEqual({ weekIndex: 1, dayIndex: 2 });
    });

    it('sets hoveredCell for Finalizado', () => {
      component.tema.estado = 'Finalizado';
      component.onMouseEnter(0, 1, null);
      expect(component.hoveredCell).toEqual({ weekIndex: 0, dayIndex: 1 });
    });

    it('sets hoveredCell when hayEvento is true', () => {
      spyOn(component, 'hayEvento').and.returnValue(true);
      component.onMouseEnter(2, 3, 5);
      expect(component.hoveredCell).toEqual({ weekIndex: 2, dayIndex: 3 });
    });

    it('does not set hoveredCell otherwise', () => {
      spyOn(component, 'hayEvento').and.returnValue(false);
      component.onMouseEnter(4, 5, 6);
      expect(component.hoveredCell).toBeNull();
    });

    it('onMouseLeave clears hoveredCell', () => {
      component.hoveredCell = { weekIndex: 9, dayIndex: 9 };
      component.onMouseLeave();
      expect(component.hoveredCell).toBeNull();
    });
  });

  it('triggerFileInput invokes click()', () => {
    spyOn(component.fileInput.nativeElement, 'click');
    component.triggerFileInput();
    expect(component.fileInput.nativeElement.click).toHaveBeenCalled();
  });

  describe('showEventos', () => {
    beforeEach(() => {
      component.year = 2025;
      component.mes = 5;
    });

    it('returns early when invalid input', () => {
      component.showEventos(null);
      // no dialog opened
      expect(dialogSpy.open).not.toHaveBeenCalled();
    });

    it('opens list dialog for multiple events', () => {
      component.eventos = [
        { fecha: '2025-06-10', titulo: 'A', contenido: '1' },
        { fecha: '2025-06-10', titulo: 'B', contenido: '2' }
      ];
      const dialogRef = { afterOpened: () => ({ subscribe: () => {} }) } as MatDialogRef<any>;
      dialogSpy.open.and.returnValue(dialogRef);

      component.showEventos(10);
      expect(dialogSpy.open).toHaveBeenCalledWith(
        ConfirmDialogComponent,
        jasmine.objectContaining({ data: jasmine.objectContaining({ title: 'Eventos' }) })
      );
    });

    it('opens single-div dialog for one event', () => {
      component.eventos = [{ fecha: '2025-06-11', titulo: 'Solo', contenido: 'X' }];
      const dialogRef = { afterOpened: () => ({ subscribe: () => {} }) } as MatDialogRef<any>;
      dialogSpy.open.and.returnValue(dialogRef);

      component.showEventos(11);
      expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('logs when no events', () => {
      component.eventos = [];
      const spy = spyOn(console, 'log');
      component.showEventos(12);
      expect(spy).toHaveBeenCalledWith('No hay eventos para este día');
    });
  });

  describe('getEventosDia & hayEvento', () => {
    beforeEach(() => {
      component.year = 2025;
      component.mes = 5;
      component.eventos = [{ fecha: '2025-06-20' }];
    });

    it('getEventosDia returns matches', () => {
      expect(component.getEventosDia(20).length).toBe(1);
    });

    it('getEventosDia returns [] on invalid', () => {
      (component as any).year = NaN;
      expect(component.getEventosDia(1)).toEqual([]);
    });

    it('hayEvento true/false', () => {
      expect(component.hayEvento(20)).toBeTrue();
      expect(component.hayEvento(1)).toBeFalse();
    });

    it('hayEvento handles parse error', () => {
      (component as any).mes = NaN;
      expect(component.hayEvento(1)).toBeFalse();
    });
  });

  describe('getEventos & subirAvance methods', () => {
    it('rejects getEventos when no tema', async () => {
      component.tema = undefined as any;
      const spy = spyOn(console, 'error');
      await expectAsync(component.getEventos()).toBeRejectedWith('Tema no disponible o sin ID');
      expect(spy).toHaveBeenCalledWith('Tema no disponible o sin ID');
    });

    it('subirAvance resolves on success', async () => {
      httpSpy.subirAvance.and.returnValue(Promise.resolve(of({})));
      await expectAsync(component.subirAvance({})).toBeResolved();
    });

    it('subirAvance rejects and logs on error', async () => {
      httpSpy.subirAvance.and.returnValue(Promise.resolve(throwError(() => 'err')));
      const spy = spyOn(console, 'error');
      await expectAsync(component.subirAvance({})).toBeRejected();
      expect(spy).toHaveBeenCalledWith('Error subiendo avance');
    });
  });
});
