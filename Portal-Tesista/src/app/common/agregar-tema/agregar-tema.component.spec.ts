import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AgregarTemaComponent } from './agregar-tema.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpRequestService } from '../Http-request.service';
import { By } from '@angular/platform-browser';

describe('AgregarTemaComponent', () => {
  let component: AgregarTemaComponent;
  let fixture: ComponentFixture<AgregarTemaComponent>;
  let httpRequestService: HttpRequestService;

  const mockUserRepresentation = {
    escuela: 'Escuela de Prueba',
    rut: '12345678-9'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarTemaComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarTemaComponent);
    component = fixture.componentInstance;
    component.userRepresentation = mockUserRepresentation;
    httpRequestService = TestBed.inject(HttpRequestService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call service when title or summary is empty', () => {
    const addTemaSpy = spyOn(httpRequestService, 'addTema');
    
    (component as any).titulo = '';
    (component as any).resumen = '';
    component.onSubmit();
    
    expect(component.loading).toBeFalse();
    expect(addTemaSpy).not.toHaveBeenCalled();
  });

  it('should call service and close overlay on successful submission', fakeAsync(() => {
    (component as any).titulo = 'Título válido';
    (component as any).resumen = 'Resumen válido';
    
    const addTemaSpy = spyOn(httpRequestService, 'addTema').and.returnValue(
      Promise.resolve(of({}))
    );
    const closeSpy = spyOn(component.close, 'emit');
    
    component.onSubmit();
    expect(component.loading).toBeTrue();
    
    tick();
    fixture.detectChanges();
    
    expect(component.loading).toBeFalse();
    expect(addTemaSpy).toHaveBeenCalledWith({
      titulo: 'Título válido',
      resumen: 'Resumen válido',
      nombre_escuela: 'Escuela de Prueba',
      rut_guia: '12345678-9'
    });
    expect(closeSpy).toHaveBeenCalled();
  }));

  it('should handle error and close overlay on service failure', fakeAsync(() => {
    (component as any).titulo = 'Título válido';
    (component as any).resumen = 'Resumen válido';
    
    const addTemaSpy = spyOn(httpRequestService, 'addTema').and.returnValue(
      Promise.resolve(throwError(() => new Error('Test error')))
    );
    const consoleSpy = spyOn(console, 'error');
    const closeSpy = spyOn(component.close, 'emit');
    
    component.onSubmit();
    tick();
    fixture.detectChanges();
    
    expect(component.loading).toBeFalse();
    expect(addTemaSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Error creando tema');
    expect(closeSpy).toHaveBeenCalled();
  }));

  it('should close overlay when clicking outside', () => {
    const closeSpy = spyOn(component, 'closeOverlay');
    
    // Crear elemento fuera del componente
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    
    // Crear evento con target manual
    const event = new MouseEvent('click');
    Object.defineProperty(event, 'target', { value: outsideElement });
    
    component.clickout(event);
    
    expect(closeSpy).toHaveBeenCalled();
    document.body.removeChild(outsideElement);
  });

  it('should not close overlay when clicking inside', () => {
    const closeSpy = spyOn(component, 'closeOverlay');
    
    // Crear elemento dentro del componente
    const insideElement = fixture.debugElement.query(By.css('form')).nativeElement;
    
    // Crear evento con target manual
    const event = new MouseEvent('click');
    Object.defineProperty(event, 'target', { value: insideElement });
    
    component.clickout(event);
    
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should emit close event when closeOverlay is called', () => {
    const emitSpy = spyOn(component.close, 'emit');
    
    component.closeOverlay();
    
    expect(emitSpy).toHaveBeenCalled();
  });
});