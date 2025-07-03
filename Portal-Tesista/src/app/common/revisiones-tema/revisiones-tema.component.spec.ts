import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RevisionesTemaComponent } from './revisiones-tema.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { HttpRequestService } from '../Http-request.service';
import { of, throwError } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RevisionesTemaComponent', () => {
  let component: RevisionesTemaComponent;
  let fixture: ComponentFixture<RevisionesTemaComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let httpServiceSpy: jasmine.SpyObj<HttpRequestService>;

  const mockTemas = [{
    id: 1,
    titulo: 'Tema 1',
    resumen: 'Resumen',
    estado: 'En revisión',
    numero_fase: 1,
    id_fase: 1,
    nombre_escuela: 'Escuela X',
    rut_guia: '12345678-9',
    guia: 'Profe',
    co_guias: ['Co1'],
    creacion: '2025-01-01'
  }];

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);
    httpServiceSpy = jasmine.createSpyObj('HttpRequestService', ['getTemasRevisionUsuario', 'getUltimoAvanceTema']);

    await TestBed.configureTestingModule({
      declarations: [RevisionesTemaComponent],
      imports: [
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: UserService, useValue: userServiceSpy },
        { provide: HttpRequestService, useValue: httpServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RevisionesTemaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();  // dispara ngOnInit y hooks de vista
    expect(component).toBeTruthy();
  });

  it('should load temas on init', fakeAsync(() => {
    userServiceSpy.getUser.and.returnValue({ rut: '123' });
    httpServiceSpy.getTemasRevisionUsuario.and.returnValue(Promise.resolve(of(mockTemas)));

    fixture.detectChanges();  // ngOnInit
    tick();                   // resuelve la Promise interna

    expect((component as any).temas.length).toBe(1);
    expect(component.dataSource.data.length).toBe(1);
    expect(component.loading).toBeFalse();
  }));

  it('should handle missing rut error', fakeAsync(() => {
    spyOn(console, 'error');
    userServiceSpy.getUser.and.returnValue({});
    httpServiceSpy.getTemasRevisionUsuario.and.returnValue(Promise.resolve(of([])));

    fixture.detectChanges();
    tick();

    expect(console.error).toHaveBeenCalledWith('User representation or RUT is not available');
    expect(component.loading).toBeFalse();
  }));

  it('should handle fetchTemas observable error', fakeAsync(() => {
    spyOn(console, 'error');
    userServiceSpy.getUser.and.returnValue({ rut: '123' });
    httpServiceSpy.getTemasRevisionUsuario.and.returnValue(Promise.resolve(throwError(() => new Error('fail'))));

    fixture.detectChanges();
    tick();

    expect(console.error).toHaveBeenCalledWith('Error fetching temas');
    expect(component.loading).toBeFalse();
  }));

  it('should revisarTema and set estado', fakeAsync(() => {
    httpServiceSpy.getUltimoAvanceTema.and.returnValue(Promise.resolve(of({ detalle: 'avance' })));
    fixture.detectChanges();

    component.revisarTema(mockTemas[0]).then(() => {
      expect(component.revisar).toBeTrue();
      expect(component.temaSeleccionado).toEqual(mockTemas[0]);
    });
  }));

  it('should handle getAvanceTema error', fakeAsync(() => {
    spyOn(console, 'error');
    httpServiceSpy.getUltimoAvanceTema.and.returnValue(Promise.resolve(throwError(() => new Error('fail'))));
    fixture.detectChanges();

    component.getAvanceTema(1).catch(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching avance tema');
    });
  }));

  it('should close revisarTema', () => {
    component.revisar = true;
    component.closeRevisarTema();
    expect(component.revisar).toBeFalse();
  });
});
