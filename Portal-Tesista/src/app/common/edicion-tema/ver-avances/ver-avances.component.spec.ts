import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VerAvancesComponent, Profesor } from './ver-avances.component';
import { HttpRequestService } from '../../Http-request.service';
import { of, throwError } from 'rxjs';

describe('VerAvancesComponent', () => {
  let component: VerAvancesComponent;
  let fixture: ComponentFixture<VerAvancesComponent>;
  let httpSpy: jasmine.SpyObj<HttpRequestService>;

  const temaMock = { id: 1 };
  const userMock = { tipo: 'cargo', escuela: 'Esc1', rut: 'R1' };
  const avanceMock = { archivo: 'data:application/pdf;base64,QUJD', tipoMime: 'application/pdf', nombre_archivo: 'doc.pdf' };
  // Use Profesor interface shape
  const profesorItems: Profesor[] = [{ nombre: 'P A', rut: 'R2', email: 'p@e.com' }];
  const revisoresData = [...profesorItems];

  beforeEach(async () => {
    httpSpy = jasmine.createSpyObj('HttpRequestService', [
      'getAvancesTema', 'getProfesores', 'getRevisoresTema', 'addRevisor', 'borrarRevisor'
    ]);

    await TestBed.configureTestingModule({
      declarations: [VerAvancesComponent],
      providers: [{ provide: HttpRequestService, useValue: httpSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(VerAvancesComponent);
    component = fixture.componentInstance;
    component.tema = temaMock;
    component.userRepresentation = userMock;
  });

  it('should create and init', fakeAsync(() => {
    httpSpy.getAvancesTema.and.returnValue(Promise.resolve(of([avanceMock])));
    httpSpy.getProfesores.and.returnValue(Promise.resolve(of(profesorItems)));
    httpSpy.getRevisoresTema.and.returnValue(Promise.resolve(of(revisoresData)));

    component.ngOnInit();
    tick();

    expect(component.loading).toBeFalse();
    expect((component as any).avances).toEqual([avanceMock]);
    expect((component as any).profesores).toEqual(profesorItems);
    expect((component as any).revisores).toEqual(revisoresData);
    expect((component as any).dataSource.length).toBe(1);
    expect(component.esCargo).toBeTrue();
  }));

  it('should handle error in fetchAvances', fakeAsync(() => {
    httpSpy.getAvancesTema.and.returnValue(Promise.resolve(throwError(() => new Error('e'))));
    httpSpy.getProfesores.and.returnValue(Promise.resolve(of([])));
    httpSpy.getRevisoresTema.and.returnValue(Promise.resolve(of([])));
    spyOn(console, 'error');

    component.ngOnInit();
    tick();

    expect((component as any).avances).toBeNull();
    expect(component.loading).toBeFalse();
  }));

  it('should not sacarRevisor if no element', fakeAsync(() => {
    spyOn(console, 'error');
    component.sacarRevisor(null as any);
    tick();
    expect(console.error).toHaveBeenCalledWith('Elemento no seleccionado');
  }));

  it('should sacarRevisor success and error', fakeAsync(() => {
    httpSpy.borrarRevisor.and.returnValue(Promise.resolve(of(revisoresData)));
    httpSpy.getRevisoresTema.and.returnValue(Promise.resolve(of(revisoresData)));
    component.sacarRevisor(profesorItems[0]);
    tick();
    expect(httpSpy.borrarRevisor).toHaveBeenCalled();
    expect(httpSpy.getRevisoresTema).toHaveBeenCalledWith(1);

    httpSpy.borrarRevisor.and.returnValue(Promise.resolve(throwError(() => new Error('e2'))));
    spyOn(console, 'error');
    component.sacarRevisor(profesorItems[0]);
    tick();
    expect(console.error).toHaveBeenCalledWith('Error al eliminar revisor');
  }));

  it('should not agregarRevisor if none selected', fakeAsync(() => {
    spyOn(console, 'error');
    component.profesorSeleccionado = undefined;
    component.agregarRevisor();
    tick();
    expect(console.error).toHaveBeenCalledWith('Ningún profesor seleccionado');
  }));

  it('should agregarRevisor success and error', fakeAsync(() => {
    component.profesorSeleccionado = profesorItems[0];
    httpSpy.addRevisor.and.returnValue(Promise.resolve(of(revisoresData)));
    httpSpy.getRevisoresTema.and.returnValue(Promise.resolve(of(revisoresData)));
    component.agregarRevisor();
    tick();
    expect(httpSpy.addRevisor).toHaveBeenCalled();
    expect(httpSpy.getRevisoresTema).toHaveBeenCalledWith(1);

    httpSpy.addRevisor.and.returnValue(Promise.resolve(throwError(() => new Error('e3'))));
    spyOn(console, 'error');
    component.agregarRevisor();
    tick();
    expect(console.error).toHaveBeenCalledWith('Error al agregar revisor');
  }));

  it('should abrir and cerrar avance', () => {
    component.abrir_avance(avanceMock);
    expect(component.ver_avance).toBeTrue();
    expect(component.avanceSeleccionado).toBe(avanceMock);
    component.cerrar_avance();
    expect(component.ver_avance).toBeFalse();
  });

  it('should not descargarAvance if missing', () => {
    spyOn(console, 'error');
    component.descargarAvance({});
    expect(console.error).toHaveBeenCalledWith('No file available to download');
  });

  it('should descargarAvance success and error', () => {
    spyOn(document, 'createElement').and.returnValue({ click: () => {}, href: '', download: '' } as any);
    spyOn(URL, 'createObjectURL').and.returnValue('url');
    spyOn(URL, 'revokeObjectURL');
    component.descargarAvance(avanceMock);
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

});
