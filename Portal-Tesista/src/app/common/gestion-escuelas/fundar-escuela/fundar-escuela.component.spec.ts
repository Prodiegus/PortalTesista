import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FundarEscuelaComponent } from './fundar-escuela.component';
import { Router } from '@angular/router';
import { CONST } from '../../const/const';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { HttpRequestService } from '../../Http-request.service';

describe('FundarEscuelaComponent', () => {
  let component: FundarEscuelaComponent;
  let fixture: ComponentFixture<FundarEscuelaComponent>;
  let httpRequestService: HttpRequestService;
  let router: Router;

  const mockUserRepresentation = { /* ... */ };
  const mockEscuelas = [{ nombre: 'Escuela1' }, { nombre: 'Escuela2' }];
  const mockProfesores = [
    { rut: '1', tipo: 'cargo' },
    { rut: '2', tipo: 'normal' },
    { rut: '3', tipo: 'cargo' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundarEscuelaComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => ({
              extras: {
                state: {
                  userRepresentation: mockUserRepresentation,
                  escuelas: mockEscuelas
                }
              }
            }),
            navigate: jasmine.createSpy('navigate')
          }
        }
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FundarEscuelaComponent);
    component = fixture.componentInstance;
    httpRequestService = TestBed.inject(HttpRequestService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should initialize and fetch profesores', fakeAsync(() => {
    spyOn(httpRequestService, 'getProfesores').and.returnValues(
      Promise.resolve(of([mockProfesores[0]])),
      Promise.resolve(of([mockProfesores[2]]))
    );
    
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    
    expect(component.loading).toBeFalse();
    expect(component.profesores.length).toBe(2);
    expect(component.profesores).toEqual([
      jasmine.objectContaining({ tipo: 'cargo' }),
      jasmine.objectContaining({ tipo: 'cargo' })
    ]);
  }));

  xit('should handle error in ngOnInit', fakeAsync(() => {
    spyOn(httpRequestService, 'getProfesores').and.returnValue(
      Promise.reject('Error simulado')
    );
    spyOn(console, 'error');
    
    component.ngOnInit();
    tick();
    
    expect(console.error).toHaveBeenCalledWith('Error fetching profesores');
    expect(component.loading).toBeFalse();
  }));

  it('should close overlay', () => {
    spyOn(component.close, 'emit');
    component.closeOverlay();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should not submit invalid form', () => {
    component.nombre = '';
    component.cargo = null;
    spyOn(component, 'crearEscuela');
    
    component.onSubmit();
    
    expect(component.crearEscuela).not.toHaveBeenCalled();
  });

  it('should submit valid form', fakeAsync(() => {
    component.nombre = 'Nueva Escuela';
    component.cargo = { rut: '123' };
    spyOn(component, 'crearEscuela').and.returnValue(Promise.resolve());
    spyOn(component, 'closeOverlay');
    
    component.onSubmit();
    tick();
    
    expect(component.crearEscuela).toHaveBeenCalledWith({
      nombre: 'Nueva Escuela',
      rut_profesor_cargo: '123'
    });
    expect(component.closeOverlay).toHaveBeenCalled();
  }));

  it('should create escuela successfully', fakeAsync(() => {
    const mockResponse = { success: true };
    spyOn(httpRequestService, 'crearEscuela').and.returnValue(
      Promise.resolve(of(mockResponse))
    );
    
    let result: any;
    component.crearEscuela({ nombre: 'Test', rut_profesor_cargo: '123' })
      .then(() => result = true)
      .catch(() => result = false);
    
    tick();
    
    expect(result).toBeTrue();
    expect(httpRequestService.crearEscuela).toHaveBeenCalled();
  }));

  it('should handle error when creating escuela', fakeAsync(() => {
    spyOn(httpRequestService, 'crearEscuela').and.returnValue(
      Promise.resolve(throwError(() => new Error('Error')))
    );
    spyOn(console, 'error');
    
    let errorCaught = false;
    component.crearEscuela({} as any)
      .catch(() => errorCaught = true);
    
    tick();
    
    expect(errorCaught).toBeTrue();
    expect(console.error).toHaveBeenCalledWith('Error creando escuela');
  }));

  it('should close when clicking outside', () => {
    const event = new MouseEvent('click');
    const element = fixture.nativeElement;
    
    // Simular click fuera del componente
    spyOn((component as any).elementRef.nativeElement, 'contains').and.returnValue(false);
    spyOn(component, 'closeOverlay');
    
    // Disparar evento
    document.dispatchEvent(event);
    
    expect(component.closeOverlay).toHaveBeenCalled();
  });

  it('should not close when clicking inside', () => {
    const event = new MouseEvent('click');
    
    // Simular click dentro del componente
    spyOn((component as any).elementRef.nativeElement, 'contains').and.returnValue(true);
    spyOn(component, 'closeOverlay');
    
    // Disparar evento
    document.dispatchEvent(event);
    
    expect(component.closeOverlay).not.toHaveBeenCalled();
  });

  xit('should fetch and filter profesores', fakeAsync(() => {
    spyOn(httpRequestService, 'getProfesores').and.returnValues(
      Promise.resolve(of([mockProfesores[0], mockProfesores[1]])),
      Promise.resolve(of([mockProfesores[2]]))
    );
    
    component.fetchProfesores();
    tick();
    
    expect(component.profesores.length).toBe(2);
    expect(component.profesores).toEqual([
      jasmine.objectContaining({ tipo: 'cargo' }),
      jasmine.objectContaining({ tipo: 'cargo' })
    ]);
  }));
});