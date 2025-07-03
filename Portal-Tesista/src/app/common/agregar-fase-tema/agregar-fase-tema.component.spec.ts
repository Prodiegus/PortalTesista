import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AgregarFaseTemaComponent } from './agregar-fase-tema.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { HttpRequestService } from '../Http-request.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('AgregarFaseTemaComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: AgregarFaseTemaComponent;
  let fixture: ComponentFixture<AgregarFaseTemaComponent>;
  let httpRequestService: HttpRequestService;

  const mockUserRepresentation = {
    rut: '12345678-9',
    tipo: 'admin'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarFaseTemaComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarFaseTemaComponent);
    component = fixture.componentInstance;
    
    // Inicializar los inputs
    component.userRepresentation = mockUserRepresentation;
    component.id_padre = 1;
    component.id_tema = 2;

    httpRequestService = TestBed.inject(HttpRequestService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    // Dejar campos vacíos
    component.nombre = '';
    component.descripcion = '';
    component.fecha_inicio = '';
    component.fecha_termino = '';

    spyOn(component, 'add');
    component.onSubmit();

    expect(component.add).not.toHaveBeenCalled();
  });

  it('should show error if date range is invalid', () => {
    // Fecha de inicio posterior a fecha de término
    component.nombre = 'Fase 1';
    component.descripcion = 'Descripción';
    component.fecha_inicio = '2025-01-01';
    component.fecha_termino = '2024-01-01';

    spyOn(component, 'add');
    component.onSubmit();

    expect(component.rangoErroneo).toBeTrue();
    expect(component.add).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should submit valid form and handle success', fakeAsync(() => {
    // Datos válidos
    component.nombre = 'Fase 1';
    component.descripcion = 'Descripción';
    component.fecha_inicio = '2024-01-01';
    component.fecha_termino = '2025-01-01';

    // Mock de la respuesta exitosa
    spyOn(httpRequestService, 'addFasesTema').and.returnValue(
      Promise.resolve(of({ success: true }))
    );
    spyOn(component, 'closeOverlay');

    component.onSubmit();
    tick();

    expect(component.rangoErroneo).toBeFalse();
    expect(component.loading).toBeFalse();
    expect(component.closeOverlay).toHaveBeenCalled();
  }));


  it('should close overlay when clicking outside', () => {
    const event = new MouseEvent('click');
    spyOn((component as any).elementRef.nativeElement, 'contains').and.returnValue(false);
    spyOn(component, 'closeOverlay');

    document.dispatchEvent(event);

    expect(component.closeOverlay).toHaveBeenCalled();
  });

  it('should not close overlay when clicking inside', () => {
    const event = new MouseEvent('click');
    spyOn((component as any).elementRef.nativeElement, 'contains').and.returnValue(true);
    spyOn(component, 'closeOverlay');

    document.dispatchEvent(event);

    expect(component.closeOverlay).not.toHaveBeenCalled();
  });

  it('should close overlay via closeOverlay method', () => {
    spyOn(component.close, 'emit');
    component.closeOverlay();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should format dates correctly', () => {
    // Simulamos el formato que se usa en el componente
    const fechaInicio = '2024-01-01T00:00';
    const fechaTermino = '2025-01-01T00:00';

    component.fecha_inicio = fechaInicio;
    component.fecha_termino = fechaTermino;

    const formattedInicio = new Date(fechaInicio).toISOString().slice(0, 19).replace('T', ' ');
    const formattedTermino = new Date(fechaTermino).toISOString().slice(0, 19).replace('T', ' ');
    component
    // Llamamos a onSubmit para que se formateen
    component.nombre = 'Fase';
    component.descripcion = 'Desc';
    component.onSubmit();

    // Verificamos que las fechas en el objeto addFaseFlujo estén formateadas
    expect(component.addFaseFlujo.fecha_inicio).toBe(formattedInicio);
    expect(component.addFaseFlujo.fecha_termino).toBe(formattedTermino);
  });

});
