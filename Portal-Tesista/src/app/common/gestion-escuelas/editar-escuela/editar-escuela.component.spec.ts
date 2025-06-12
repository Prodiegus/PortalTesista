import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditarEscuelaComponent } from './editar-escuela.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { HttpRequestService } from '../../Http-request.service';

describe('EditarEscuelaComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: EditarEscuelaComponent;
  let fixture: ComponentFixture<EditarEscuelaComponent>;
  let httpRequestServiceSpy: jasmine.SpyObj<HttpRequestService>;

  const mockEscuela = {
    nombre: 'Ingeniería',
    rut_profesor_cargo: '12345678-9'
  };

  const mockProfesores = [
    { rut: '12345678-9', tipo: 'cargo' },
    { rut: '98765432-1', tipo: 'docente' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('HttpRequestService', ['getProfesores', 'editarEscuela']);

    await TestBed.configureTestingModule({
      declarations: [EditarEscuelaComponent],
      imports: [FormsModule, HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: HttpRequestService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarEscuelaComponent);
    component = fixture.componentInstance;
    httpRequestServiceSpy = TestBed.inject(HttpRequestService) as jasmine.SpyObj<HttpRequestService>;
    component.escuela = mockEscuela;
    component.escuelas = [mockEscuela];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load profesores and match cargo on init', fakeAsync(() => {
    httpRequestServiceSpy.getProfesores.and.returnValue(Promise.resolve(of(mockProfesores)));

    component.ngOnInit();
    tick();

    expect(component.cargo).toEqual(mockProfesores[0]);
    expect(component.loading).toBeFalse();
  }));

  it('should emit close when closeOverlay is called', () => {
    spyOn(component.close, 'emit');
    component.closeOverlay();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should submit and call editarEscuela', fakeAsync(() => {
    spyOn(component, 'closeOverlay');
    httpRequestServiceSpy.editarEscuela.and.returnValue(Promise.resolve(of({})));

    component.cargo = mockProfesores[0];
    component.onSubmit();
    tick();

    expect(httpRequestServiceSpy.editarEscuela).toHaveBeenCalled();
    expect(component.closeOverlay).toHaveBeenCalled();
  }));

  it('should handle error during editarEscuela', fakeAsync(() => {
    httpRequestServiceSpy.editarEscuela.and.returnValue(Promise.resolve(throwError(() => new Error('Error'))));

    component.cargo = mockProfesores[0];
    component.onSubmit();
    tick();

    expect(component.editando).toBeFalse();
  }));
});

