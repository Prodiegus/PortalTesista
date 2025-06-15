import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GestionEscuelasComponent } from './gestion-escuelas.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { UserService } from '../user.service';
import { HttpRequestService } from '../Http-request.service';
import { Component, Input } from '@angular/core';

@Component({ selector: 'app-home-header', template: '' })
class MockHomeHeaderComponent {
  @Input() userRepresentation: any;
}

describe('GestionEscuelasComponent', () => {
  let component: GestionEscuelasComponent;
  let fixture: ComponentFixture<GestionEscuelasComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockHttpRequestService: jasmine.SpyObj<HttpRequestService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUser']);
    mockHttpRequestService = jasmine.createSpyObj('HttpRequestService', ['getEscuelas']);

    await TestBed.configureTestingModule({
      declarations: [
        GestionEscuelasComponent,
        MockHomeHeaderComponent
      ],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: HttpRequestService, useValue: mockHttpRequestService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionEscuelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should fetch user and escuelas successfully', fakeAsync(async () => {
    const escuelasMock = [{ id: 1, nombre: 'Escuela A' }];
    mockUserService.getUser.and.returnValue({ nombre: 'Admin' });
    mockHttpRequestService.getEscuelas.and.returnValue(Promise.resolve(of(escuelasMock)));

    await component.ngOnInit();
    expect(component.userRepresentation).toEqual({ nombre: 'Admin' });
    expect((component as any).escuelas).toEqual(escuelasMock);
    expect(component.loading).toBeFalse();
  }));

  it('ngOnInit should handle error when user service or fetch fails', fakeAsync(async () => {
    spyOn(console, 'error');
    mockUserService.getUser.and.throwError(new Error('fail'));

    await component.ngOnInit();
    expect(console.error).toHaveBeenCalledWith('Error fetching user representation:', jasmine.any(Error));
    expect(component.loading).toBeFalse();
  }));

  it('fetchEscuelas should populate escuelas on success', fakeAsync(() => {
    const mockData = [{ id: 1, nombre: 'Escuela A' }];
    mockHttpRequestService.getEscuelas.and.returnValue(Promise.resolve(of(mockData)));

    component.fetchEscuelas().then(() => {
      expect((component as any).escuelas).toEqual(mockData);
    });
    tick();
  }));

  it('fetchEscuelas should handle error', fakeAsync(() => {
    spyOn(console, 'error');
    mockHttpRequestService.getEscuelas.and.returnValue(Promise.resolve(throwError(() => new Error('fail'))));

    component.fetchEscuelas().catch(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching escuelas');
    });
    tick();
  }));

  it('fundarEscuela should set fundarEscuelaPopup to true', () => {
    component.fundarEscuela();
    expect(component.fundarEscuelaPopup).toBeTrue();
  });

  it('verEscuela should set selected escuela and editarEscuelaPopup to true', () => {
    const escuelaMock = { id: 1, nombre: 'Escuela A' };
    component.verEscuela(escuelaMock);
    expect(component.escuelaSeleccionada).toBe(escuelaMock);
    expect(component.editarEscuelaPopup).toBeTrue();
  });

  it('cerrarFundarEscuela should refresh escuelas and close popup on success', fakeAsync(() => {
    const mockData = [{ id: 1, nombre: 'Escuela A' }];
    mockHttpRequestService.getEscuelas.and.returnValue(Promise.resolve(of(mockData)));

    component.fundarEscuelaPopup = true;
    component.cerrarFundarEscuela();
    tick(500);

    expect((component as any).escuelas).toEqual(mockData);
    expect(component.fundarEscuelaPopup).toBeFalse();
    expect(component.loading).toBeFalse();
  }));

  it('cerrarEdicionEscuela should refresh escuelas and close popup on success', fakeAsync(() => {
    const mockData = [{ id: 1, nombre: 'Escuela A' }];
    mockHttpRequestService.getEscuelas.and.returnValue(Promise.resolve(of(mockData)));

    component.editarEscuelaPopup = true;
    component.cerrarEdicionEscuela();
    tick(500);

    expect((component as any).escuelas).toEqual(mockData);
    expect(component.editarEscuelaPopup).toBeFalse();
    expect(component.loading).toBeFalse();
  }));

  it('cerrarEdicionEscuela should handle error', fakeAsync(() => {
    spyOn(console, 'error');
    mockHttpRequestService.getEscuelas.and.returnValue(Promise.resolve(throwError(() => new Error('fail'))));

    component.editarEscuelaPopup = true;
    component.cerrarEdicionEscuela();
    tick(500);

    expect(component.editarEscuelaPopup).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching escuelas after closing editarEscuelaPopup:',
      jasmine.any(Error)
    );
  }));

  it('sleep should delay execution', fakeAsync(() => {
    let completed = false;
    component.sleep(500).then(() => (completed = true));
    tick(500);
    expect(completed).toBeTrue();
  }));
});
