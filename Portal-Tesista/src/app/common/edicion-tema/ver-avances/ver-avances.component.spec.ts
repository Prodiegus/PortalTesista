import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VerAvancesComponent } from './ver-avances.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpRequestService } from '../../Http-request.service';
import { of, throwError } from 'rxjs';

describe('VerAvancesComponent', () => {
  let component: VerAvancesComponent;
  let fixture: ComponentFixture<VerAvancesComponent>;
  let httpRequestServiceSpy: jasmine.SpyObj<HttpRequestService>;

  const mockTema = { id: 1 };
  const mockUser = { tipo: 'cargo', escuela: 'TI', rut: '12345678-9' };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('HttpRequestService', [
      'getAvancesTema',
      'getProfesores',
      'getRevisoresTema',
      'addRevisor',
      'borrarRevisor'
    ]);

    await TestBed.configureTestingModule({
      declarations: [VerAvancesComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HttpRequestService, useValue: spy }
      ]
    }).compileComponents();

    httpRequestServiceSpy = TestBed.inject(HttpRequestService) as jasmine.SpyObj<HttpRequestService>;
    fixture = TestBed.createComponent(VerAvancesComponent);
    component = fixture.componentInstance;
    component.tema = mockTema;
    component.userRepresentation = mockUser;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch avances, profesores, and revisores on init', fakeAsync(() => {
    httpRequestServiceSpy.getAvancesTema.and.returnValue(Promise.resolve(of([])));
    httpRequestServiceSpy.getProfesores.and.returnValue(Promise.resolve(of([])));
    httpRequestServiceSpy.getRevisoresTema.and.returnValue(Promise.resolve(of([])));

    component.ngOnInit();
    tick();

    expect(component.loading).toBeFalse();
    expect(httpRequestServiceSpy.getAvancesTema).toHaveBeenCalledWith(1);
    expect(httpRequestServiceSpy.getProfesores).toHaveBeenCalledWith('TI');
    expect(httpRequestServiceSpy.getRevisoresTema).toHaveBeenCalledWith(1);
    expect(component.esCargo).toBeTrue();
  }));

  xit('should handle error in fetchAvances', fakeAsync(() => {
    httpRequestServiceSpy.getAvancesTema.and.returnValue(Promise.resolve(of(throwError(() => new Error('Error')))));
    httpRequestServiceSpy.getProfesores.and.returnValue(Promise.resolve(of([])));
    httpRequestServiceSpy.getRevisoresTema.and.returnValue(Promise.resolve(of([])));

    component.ngOnInit();
    tick();

    expect((component as any).avances).toBeNull();
    expect(component.loading).toBeFalse();
  }));

  it('should not add revisor if profesorSeleccionado is undefined', fakeAsync(() => {
    component.profesorSeleccionado = undefined;
    const consoleSpy = spyOn(console, 'error');

    component.agregarRevisor();
    tick();

    expect(consoleSpy).toHaveBeenCalledWith('Ningún profesor seleccionado');
  }));

  it('should call addRevisor and fetchRevisores when agregarRevisor is valid', fakeAsync(() => {
    component.profesorSeleccionado = { rut: '1111' };
    httpRequestServiceSpy.addRevisor.and.returnValue(Promise.resolve(of([])));
    httpRequestServiceSpy.getRevisoresTema.and.returnValue(Promise.resolve(of([])));

    component.agregarRevisor();
    tick();

    expect(httpRequestServiceSpy.addRevisor).toHaveBeenCalled();
    expect(httpRequestServiceSpy.getRevisoresTema).toHaveBeenCalledWith(1);
  }));

  it('should handle sacarRevisor properly', fakeAsync(() => {
    const mockRevisor = { rut: '12345678-9', nombre: 'Juan Perez', email: 'jp@utalca.cl' };
    httpRequestServiceSpy.borrarRevisor.and.returnValue(Promise.resolve(of([])));
    httpRequestServiceSpy.getRevisoresTema.and.returnValue(Promise.resolve(of([])));

    component.sacarRevisor(mockRevisor);
    tick();

    expect(httpRequestServiceSpy.borrarRevisor).toHaveBeenCalled();
    expect(httpRequestServiceSpy.getRevisoresTema).toHaveBeenCalledWith(1);
  }));

  it('should not descargarAvance if archivo is missing', () => {
    const consoleSpy = spyOn(console, 'error');
    component.descargarAvance({});
    expect(consoleSpy).toHaveBeenCalledWith('No file available to download');
  });
});
