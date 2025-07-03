import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditarDuenosComponent } from './editar-duenos.component';
import { HttpRequestService } from '../../Http-request.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

describe('EditarDuenosComponent', () => {
  let component: EditarDuenosComponent;
  let fixture: ComponentFixture<EditarDuenosComponent>;
  let httpSpy: jasmine.SpyObj<HttpRequestService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<any>>;

  const temaMock = { id: 42 };
  const userMock = { rut: 'u1' };
  const usuariosMock = [
    { rut: 'u1', nombre: 'Uno', apellido: 'A', correo: 'uno@e.com' },
    { rut: 'u2', nombre: 'Dos', apellido: 'B', correo: 'dos@e.com' }
  ];
  const duenosMock = [
    { rut: 'u1', nombre: 'Uno', apellido: 'A' }
  ];

  beforeEach(async () => {
    httpSpy = jasmine.createSpyObj('HttpRequestService', [
      'getDuenoTema',
      'getUsuarios',
      'addDuenoTema',
      'borrarDuenoTema'
    ]);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [EditarDuenosComponent],
      imports: [FormsModule, BrowserAnimationsModule],
      providers: [
        { provide: HttpRequestService, useValue: httpSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarDuenosComponent);
    component = fixture.componentInstance;

    component.userRepresentation = userMock;
    component.tema = temaMock;
  });

  function setupGetOwnersAndUsers() {
    httpSpy.getDuenoTema.and.returnValue(Promise.resolve(of(duenosMock)));
    httpSpy.getUsuarios.and.returnValue(Promise.resolve(of(usuariosMock)));
  }

  it('should create and load data on init', fakeAsync(() => {
    setupGetOwnersAndUsers();
    fixture.detectChanges(); // ngOnInit
    tick(); // getDuenos
    tick(); // getAllUsuarios
    expect(component.duenos).toEqual(duenosMock);
    expect(component.usuarios).toEqual(usuariosMock);
    expect(component.loading).toBeFalse();
  }));

  it('should handle errors in ngOnInit', fakeAsync(() => {
    httpSpy.getDuenoTema.and.returnValue(Promise.resolve(throwError(() => new Error('err'))));
    spyOn(console, 'error');
    fixture.detectChanges();
    tick();
    expect(console.error).toHaveBeenCalledWith('Error fetching duenos:', jasmine.any(Error));
    // no further errors for getAllUsuarios because throws earlier
  }));

  describe('rutEsDueno', () => {
    it('returns true if rut exists', () => {
      component.duenos = duenosMock;
      expect(component.rutEsDueno('u1')).toBeTrue();
    });
    it('returns false otherwise', () => {
      component.duenos = duenosMock;
      expect(component.rutEsDueno('uX')).toBeFalse();
    });
  });

  describe('agregarDueno', () => {
    beforeEach(() => {
      setupGetOwnersAndUsers();
      dialogSpy.open.and.returnValue(dialogRefSpy);
      dialogRefSpy.afterClosed.and.returnValue(of(true));
    });

    it('opens alert if no selection', fakeAsync(async () => {
      component.duenoSeleccionado = null;
      await component.agregarDueno();
      expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, jasmine.objectContaining({
        data: jasmine.objectContaining({ message: 'Debes seleccionar un dueño antes de agregarlo.' })
      }));
    }));

    it('opens alert if already owner', fakeAsync(async () => {
      component.duenos = duenosMock;
      component.duenoSeleccionado = { rut: 'u1' };
      component.userRepresentation = userMock;
      await component.agregarDueno();
      expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, jasmine.objectContaining({
        data: jasmine.objectContaining({ message: 'El usuario ya es dueño del tema.' })
      }));
    }));

    it('opens alert if user not owner', fakeAsync(async () => {
      component.duenos = [];
      component.duenoSeleccionado = { rut: 'u2' };
      component.userRepresentation = { rut: 'uX' };
      await component.agregarDueno();
      expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, jasmine.objectContaining({
        data: jasmine.objectContaining({ message: 'No puedes agregar un dueño si no eres dueño del tema.' })
      }));
    }));

    it('calls addDueno and refreshes on valid', fakeAsync(async () => {
      component.duenos = duenosMock;
      component.duenoSeleccionado = { rut: 'u2' };
      component.userRepresentation = userMock;
      spyOn(component, 'addDueno').and.returnValue(Promise.resolve());
      spyOn(component, 'getDuenos').and.returnValue(Promise.resolve());
      await component.agregarDueno();
      expect(component.addDueno).toHaveBeenCalledWith({ rut: 'u2', id_tema: temaMock.id });
      expect(component.getDuenos).toHaveBeenCalled();
      expect(component.agregarDuenoPopup).toBeFalse();
    }));

    it('handles addDueno error', fakeAsync(async () => {
      component.duenos = duenosMock;
      component.duenoSeleccionado = { rut: 'u2' };
      component.userRepresentation = userMock;
      spyOn(component, 'addDueno').and.returnValue(Promise.reject(new Error('err')));
      spyOn(console, 'error');
      await component.agregarDueno();
      expect(console.error).toHaveBeenCalledWith('Error adding dueno:', jasmine.any(Error));
    }));
  });

  describe('quitarDueno', () => {
    it('opens alert if user not owner', () => {
      component.duenos = [];
      component.userRepresentation = { rut: 'uX' };
      component.confirmarEliminarDueno({ rut: 'u1', nombre: '', apellido: '' });
      expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, jasmine.objectContaining({
        data: jasmine.objectContaining({ message: 'No puedes eliminar a un dueño si no eres dueño del tema.' })
      }));
    });

    it('opens alert if only one owner', () => {
      component.duenos = duenosMock;
      component.userRepresentation = userMock;
      component.confirmarEliminarDueno(duenosMock[0]);
      expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, jasmine.objectContaining({
        data: jasmine.objectContaining({ message: 'No puedes eliminar al último dueño del tema.' })
      }));
    });

    it('confirms and calls eliminarDueno on yes', fakeAsync(() => {
      component.duenos = [...duenosMock, { rut: 'u2' }];
      component.userRepresentation = userMock;
      dialogSpy.open.and.returnValue(dialogRefSpy);
      dialogRefSpy.afterClosed.and.returnValue(of(true));
      spyOn(component, 'quitarDueno').and.callThrough();
      spyOn(component, 'eliminarDueno').and.returnValue(Promise.resolve());
      spyOn(component, 'getDuenos').and.returnValue(Promise.resolve());

      component.confirmarEliminarDueno(duenosMock[0]);
      tick();
      expect(component.eliminarDueno).toHaveBeenCalledWith({ rut: 'u1', id_tema: temaMock.id });
    }));
  });

  describe('eliminarDueno', () => {
    it('deletes then refreshes', fakeAsync(async () => {
      httpSpy.borrarDuenoTema.and.returnValue(Promise.resolve(of({})));
      spyOn(component, 'getDuenos').and.returnValue(Promise.resolve());
      await component.eliminarDueno({ rut: 'u1', id_tema: temaMock.id });
      tick();
      expect(component.getDuenos).toHaveBeenCalled();
    }));

    it('handles delete error', fakeAsync(async () => {
      // Stub de borrarDuenoTema que rechaza…
      httpSpy.borrarDuenoTema.and.returnValue(Promise.resolve(throwError(() => new Error('err'))));
      // Stub de getDuenoTema para que getDuenos() no explote en el finally
      httpSpy.getDuenoTema.and.returnValue(Promise.resolve(of([])));
      spyOn(console, 'error');

      await component.quitarDueno('u1');
      tick(); // avanza la promise interna de getDuenoTema

      expect(console.error).toHaveBeenCalledWith('Error deleting dueno:', jasmine.any(Error));
    }));

  });

  describe('filtrarUsuarios & seleccionarUsuario', () => {
    it('filters by nombre or correo', () => {
      component.usuarios = usuariosMock;
      component.nuevoDueno = 'dos';
      component.filtrarUsuarios();
      expect(component.usuariosFiltrados).toEqual([usuariosMock[1]]);
      component.nuevoDueno = '';
      component.filtrarUsuarios();
      expect(component.usuariosFiltrados).toEqual([]);
    });

    it('selects usuario correctly', () => {
      component.seleccionarUsuario(usuariosMock[0]);
      expect(component.nuevoDueno).toBe('Uno A');
      expect(component.duenoSeleccionado).toBe(usuariosMock[0]);
      expect(component.usuariosFiltrados).toEqual([]);
    });
  });

});
