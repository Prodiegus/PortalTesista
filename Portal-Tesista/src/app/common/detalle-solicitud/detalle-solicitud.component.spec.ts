import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DetalleSolicitudComponent } from './detalle-solicitud.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CONST } from '../const/const';
import { HttpRequestService } from '../Http-request.service';
import { of, throwError } from 'rxjs';

describe('DetalleSolicitudComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: DetalleSolicitudComponent;
  let fixture: ComponentFixture<DetalleSolicitudComponent>;
  let httpRequestService: HttpRequestService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleSolicitudComponent],
      imports: [
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleSolicitudComponent);
    component = fixture.componentInstance;

    component.userRepresentation = CONST.userRepresentation;
    component.tema = { id: 123, nombre: 'Tema de prueba' };
    component.solicitud = { rut: '12345678-9' };

    httpRequestService = TestBed.inject(HttpRequestService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when closeOverlay is called', () => {
    spyOn(component.close, 'emit');
    component.closeOverlay();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should close overlay when clicking outside component', () => {
    const event = new MouseEvent('click');
    spyOn(component, 'closeOverlay');
    
    const nativeElement = fixture.nativeElement;
    spyOn(nativeElement, 'contains').and.returnValue(false);
    component.clickout(event);
    
    expect(component.closeOverlay).toHaveBeenCalled();
  });

  it('should NOT close overlay when clicking inside component', () => {
    const event = new MouseEvent('click');
    spyOn(component, 'closeOverlay');
    
    const nativeElement = fixture.nativeElement;
    spyOn(nativeElement, 'contains').and.returnValue(true);
    component.clickout(event);
    
    expect(component.closeOverlay).not.toHaveBeenCalled();
  });

  it('should handle successful request in aceptarSolicitud', fakeAsync(() => {
    spyOn(component, 'closeOverlay');
    spyOn(httpRequestService, 'aceptarTema').and.returnValue(Promise.resolve(of({})));

    component.aceptarSolicitud();
    expect(component.loading).toBeTrue();

    tick(); 
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.closeOverlay).toHaveBeenCalled();
  }));

  it('should handle error in aceptarSolicitud', fakeAsync(() => {
    spyOn(component, 'closeOverlay');
    spyOn(console, 'error');
    
    spyOn(httpRequestService, 'aceptarTema').and.returnValue(
      Promise.resolve(throwError(() => 'Error de prueba'))
    );

    component.aceptarSolicitud();
    expect(component.loading).toBeTrue();

    tick();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith('Error aceptando solicitud');
    expect(component.closeOverlay).toHaveBeenCalled();
  }));

  it('should call http service with correct parameters', fakeAsync(() => {
    const expectedPayload = {
      topic_id: component.tema.id,
      rut_alumno: component.solicitud.rut
    };

    spyOn(httpRequestService, 'aceptarTema').and.returnValue(Promise.resolve(of({})));

    component.aceptarSolicitud();
    tick();

    expect(httpRequestService.aceptarTema).toHaveBeenCalledWith(expectedPayload);
  }));
});
