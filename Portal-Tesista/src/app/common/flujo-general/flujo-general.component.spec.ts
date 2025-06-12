import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlujoGeneralComponent } from './flujo-general.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '../user.service';
import { HttpRequestService } from '../Http-request.service';
import { of } from 'rxjs';

describe('FlujoGeneralComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: FlujoGeneralComponent;
  let fixture: ComponentFixture<FlujoGeneralComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let httpRequestServiceSpy: jasmine.SpyObj<HttpRequestService>;

  const mockUser = { rut: '12345678-9', escuela: 'Ingeniería' };
  const mockFlujos = [
    { id: 1, rut_creador: '98765432-1' },
    { id: 2, rut_creador: '12345678-9' }
  ];
  const mockFases = [
    { id: 1, numero: 2 },
    { id: 2, numero: 1 }
  ];

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', ['getUser']);
    const httpSpy = jasmine.createSpyObj('HttpRequestService', ['getFlujosGenerales', 'getFasesFlujo']);

    await TestBed.configureTestingModule({
      declarations: [FlujoGeneralComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: HttpRequestService, useValue: httpSpy }
      ]
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    httpRequestServiceSpy = TestBed.inject(HttpRequestService) as jasmine.SpyObj<HttpRequestService>;

    userServiceSpy.getUser.and.returnValue(mockUser);
    httpRequestServiceSpy.getFlujosGenerales.and.returnValue(Promise.resolve(of(mockFlujos)));
    httpRequestServiceSpy.getFasesFlujo.and.returnValue(Promise.resolve(of(mockFases)));

    fixture = TestBed.createComponent(FlujoGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch flujo general and fases on init', async () => {
    await component.ngOnInit();
    expect(component.flujoGeneral).toEqual(mockFlujos[1]);
    expect(component.fasesFlujo.length).toBe(2);
    expect(component.numeros).toEqual([1, 2]);
    expect(component.loading).toBeFalse();
  });

  it('should toggle add phase', () => {
    component.toggleAddPhase();
    expect(component['showAgregarFase']).toBeTrue();
  });

  it('should close add phase and fetch data again', async () => {
    component['showAgregarFase'] = true;
    await component.closeAddPhase();
    expect(component['showAgregarFase']).toBeFalse();
    expect(component.loading).toBeFalse();
  });

  it('should open detalle fase', () => {
    const fase = { id: 1, numero: 1 };
    component.abrirDetalleFase(fase);
    expect(component.faseSeleccionada).toEqual(fase);
    expect(component['showDetalleFase']).toBeTrue();
  });

  it('should close detalle fase and fetch data again', async () => {
    component['showDetalleFase'] = true;
    await component.closeDetalleFase();
    expect(component['showDetalleFase']).toBeFalse();
    expect(component.loading).toBeFalse();
  });
});

