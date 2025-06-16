import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleFaseComponent } from './detalle-fase.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CONST } from '../const/const';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('DetalleFaseComponent', () => {
  let component: DetalleFaseComponent;
  let fixture: ComponentFixture<DetalleFaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleFaseComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => ({
              extras: {
                state: {
                  userRepresentation: CONST.userRepresentation,
                  fase: CONST.fases[0],
                }
              }
            }),
            navigate: jasmine.createSpy('navigate')
          }
        }
      ],
      imports: [FormsModule, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleFaseComponent);
    component = fixture.componentInstance;

    component.userRepresentation = CONST.userRepresentation;
    component.fase = CONST.fases[0];
    component.id_flujo = 1;
    component.tema = {};
    component.numeros = [1, 2, 3];

    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize fields from fase input', () => {
    component.ngOnInit();
    expect(component.nombre).toBe(CONST.fases[0].nombre);
    expect(component.numero).toBe(CONST.fases[0].numero);
    expect(component.descripcion).toBe(CONST.fases[0].descripcion);
    expect(component.fecha_inicio).toContain('T');
    expect(component.fecha_termino).toContain('T');
  });

  it('should emit close when clicked outside', () => {
    spyOn(component.close, 'emit');
    const fakeEvent = { target: document.createElement('div') };
    spyOn(component['elementRef'].nativeElement, 'contains').and.returnValue(false);
    component.clickout(fakeEvent);
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should not emit close when clicked inside', () => {
    spyOn(component.close, 'emit');
    const fakeEvent = { target: component['elementRef'].nativeElement };
    spyOn(component['elementRef'].nativeElement, 'contains').and.returnValue(true);
    component.clickout(fakeEvent);
    expect(component.close.emit).not.toHaveBeenCalled();
  });

  it('should set rangoErroneo to true if fecha_inicio > fecha_termino', async () => {
    component.fecha_inicio = '2025-06-16T10:00';
    component.fecha_termino = '2025-06-15T10:00';

    await component.onSubmit();

    expect(component.rangoErroneo).toBeTrue();
    expect(component.loading).toBeFalse();
  });

  it('should call editarFase if fechas válidas', async () => {
    spyOn(component as any, 'editarFase').and.returnValue(Promise.resolve());
    component.fecha_inicio = '2025-06-15T10:00';
    component.fecha_termino = '2025-06-16T10:00';

    await component.onSubmit();

    expect((component as any).editarFase).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should handle error on editarFase', async () => {
    spyOn(component as any, 'editarFase').and.throwError(new Error('fail'));
    spyOn(component, 'closeOverlay');

    component.fecha_inicio = '2025-06-15T10:00';
    component.fecha_termino = '2025-06-16T10:00';

    await component.onSubmit();

    expect(component.closeOverlay).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should close overlay', () => {
    spyOn(component.close, 'emit');
    component.closeOverlay();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should call deleteFase and close overlay', async () => {
    spyOn(component as any, 'eliminarFase').and.returnValue(Promise.resolve());
    spyOn(component, 'closeOverlay');

    await component.eliminarFaseConfirm();

    expect(component.eliminando).toBeFalse();
    expect(component.closeOverlay).toHaveBeenCalled();
  });

  it('should handle error on eliminarFase', async () => {
    spyOn(component as any, 'eliminarFase').and.throwError(new Error('error'));
    spyOn(component, 'closeOverlay');

    await component.eliminarFaseConfirm();

    expect(component.eliminando).toBeFalse();
    expect(component.closeOverlay).toHaveBeenCalled();
  });

  it('should make API call in editarFase()', async () => {
    const response = of({ success: true });
    spyOn(component['httpRequestService'], 'editFaseFlujo').and.returnValue(Promise.resolve(response));
    spyOn(component.close, 'emit');

    await component.editarFase();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should make API call in eliminarFase()', async () => {
    const response = of({ success: true });
    spyOn(component['httpRequestService'], 'deleteFaseFlujo').and.returnValue(Promise.resolve(response));

    await component.eliminarFase();

    expect(component.editResponse).toEqual({ success: true });
  });
});
