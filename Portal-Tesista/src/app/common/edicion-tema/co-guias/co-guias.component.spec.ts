import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CoGuiasComponent } from './co-guias.component';
import { Router } from '@angular/router';
import { CONST } from '../../const/const';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { HttpRequestService } from '../../Http-request.service';
import { of, throwError } from 'rxjs';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

describe('CoGuiasComponent', () => {
  let component: CoGuiasComponent;
  let fixture: ComponentFixture<CoGuiasComponent>;
  let mockHttpService: jasmine.SpyObj<HttpRequestService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeAll(() => {
    spyOn(console, 'error').and.stub();
  });

  // Configuración inicial
  beforeEach(async () => {
    // Crear spies para los servicios
    mockHttpService = jasmine.createSpyObj('HttpRequestService', [
      'getCoguia',
      'getProfesores',
      'addCoguia',
      'borrarCoguia'
    ]);
    
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [CoGuiasComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => ({
              extras: { state: null } // Sin estado inicial
            }),
            navigate: jasmine.createSpy('navigate')
          }
        },
        { provide: HttpRequestService, useValue: mockHttpService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoGuiasComponent);
    component = fixture.componentInstance;
    
    // Datos de prueba
    component.userRepresentation = CONST.userRepresentation;
    component.tema = { ...CONST.temas[0], estado: 'En trabajo' };
    
    // Mockear respuestas HTTP por defecto
    mockHttpService.getCoguia.and.returnValue(Promise.resolve(of([])));
    mockHttpService.getProfesores.and.returnValue(Promise.resolve(of([])));
    
    fixture.detectChanges();
  });

  it('should initialize component properties correctly', fakeAsync(() => {
    // Configurar escenario
    component.userRepresentation.rut = 'rut-guia';
    component.tema.rut_guia = 'rut-guia';
    
    // Simular respuestas HTTP
    mockHttpService.getCoguia.and.returnValue(Promise.resolve(of([{ rut: 'co-guia' }])));
    mockHttpService.getProfesores.and.returnValue(Promise.resolve(of([{ rut: 'profesor' }])));
    
    // Ejecutar ngOnInit
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    
    // Verificaciones
    expect(component.esGuia).toBeTrue();
    expect(component.profesores.length).toBe(1);
    expect(component.usuarios.length).toBe(1);
    expect(component.loading).toBeFalse();
  }));

  it('should handle errors in ngOnInit', fakeAsync(() => {
    // Forzar error
    mockHttpService.getCoguia.and.returnValue(Promise.resolve(throwError(() => new Error('Test error'))));
    
    // Ejecutar
    component.ngOnInit();
    tick();
    
    // Verificar
    expect(console.error).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  }));

  it('should prevent adding co-guide when tema is pending', () => {
    component.tema.estado = 'Pendiente';
    component.agregarprofesor();
    
    expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: jasmine.objectContaining({ message: 'No puedes agregar un Co-Guía si el tema no está en trabajo.' })
    });
  });

  it('should successfully add co-guide', fakeAsync(() => {
    // Configurar escenario válido
    component.esGuia = true;
    component.profesoreseleccionado = { rut: 'nuevo-rut' };
    mockHttpService.addCoguia.and.returnValue(Promise.resolve(of({})));
    
    // Ejecutar
    component.agregarprofesor();
    tick();
    
    // Verificar
    expect(mockHttpService.addCoguia).toHaveBeenCalled();
    expect(component.agregarprofesorPopup).toBeFalse();
  }));
  
  it('should show alert when deleting without being guide', () => {
    component.esGuia = false;
    component.confirmarEliminarprofesor({});
    
    expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: jasmine.objectContaining({ message: 'No puedes eliminar a un Co-Guía si no guías el tema.' })
    });
  });

  xit('should delete co-guide when confirmed', fakeAsync(() => {
    // Configurar diálogo de confirmación
    const dialogRefMock = { afterClosed: () => of(true) };
    mockDialog.open.and.returnValue(dialogRefMock as any);
    
    // Mockear eliminación exitosa
    mockHttpService.borrarCoguia.and.returnValue(Promise.resolve(of({})));
    
    // Ejecutar
    component.confirmarEliminarprofesor({ rut: 'rut-eliminar' });
    tick();
    
    // Verificar
    expect(mockHttpService.borrarCoguia).toHaveBeenCalled();
  }));

  it('should filter users correctly', () => {
    component.usuarios = [
      { nombre: 'Juan', correo: 'juan@test.com' },
      { nombre: 'Maria', correo: 'maria@test.com' }
    ];
    
    // Ejecutar filtrado
    component.nuevoprofesor = 'mar';
    component.filtrarUsuarios();
    
    // Verificar
    expect(component.usuariosFiltrados.length).toBe(1);
    expect(component.usuariosFiltrados[0].nombre).toBe('Maria');
  });

  it('should select user correctly', () => {
    const usuario = { nombre: 'Test', apellido: 'User' };
    component.seleccionarUsuario(usuario);
    
    expect(component.nuevoprofesor).toBe('Test User');
    expect(component.profesoreseleccionado).toBe(usuario);
    expect(component.usuariosFiltrados.length).toBe(0);
  });

  it('should handle error when adding co-guide', fakeAsync(() => {
    component.esGuia = true;
    component.profesoreseleccionado = { rut: 'test' };
    mockHttpService.addCoguia.and.returnValue(Promise.resolve(throwError(() => new Error('Add error'))));
    
    component.agregarprofesor();
    tick();
    
    expect(console.error).toHaveBeenCalledWith('Error adding profesor:', jasmine.any(Error));
  }));

  it('should handle error when deleting co-guide', fakeAsync(() => {
    const dialogRefMock = { afterClosed: () => of(true) };
    mockDialog.open.and.returnValue(dialogRefMock as any);
    mockHttpService.borrarCoguia.and.returnValue(Promise.resolve(throwError(() => new Error('Delete error'))));
    
    component.quitarprofesor('test-rut');
    tick();
    
    expect(console.error).toHaveBeenCalledWith('Error deleting profesor:', jasmine.any(Error));
  }));

  it('should check if user is co-guide', () => {
    component.profesores = [{ rut: '123' }, { rut: '456' }];
    
    expect(component.rutEsprofesor('123')).toBeTrue();
    expect(component.rutEsprofesor('789')).toBeFalse();
  });


});