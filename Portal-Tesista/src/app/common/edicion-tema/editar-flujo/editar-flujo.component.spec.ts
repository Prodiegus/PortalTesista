import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditarFlujoComponent } from './editar-flujo.component';
import { Router, Navigation } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { HttpRequestService } from '../../Http-request.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

describe('EditarFlujoComponent', () => {
  let component: EditarFlujoComponent;
  let fixture: ComponentFixture<EditarFlujoComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpSpy: jasmine.SpyObj<HttpRequestService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const temaMock = { id: 99, estado: 'Pendiente', rut_guia: 'RG1' };
  const userAlumno = { tipo: 'alumno', rut: 'U1', escuela: 'E1' };
  const userProfe = { tipo: 'profesor', rut: 'U2', escuela: 'E1' };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['getCurrentNavigation', 'navigate']);
    routerSpy.getCurrentNavigation.and.returnValue({
      extras: { state: { userRepresentation: userAlumno, tema: temaMock } }
    } as any as Navigation);

    httpSpy = jasmine.createSpyObj('HttpRequestService', [
      'getFlujosGenerales',
      'getFasesFlujo',
      'getFasesTema'
    ]);

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [EditarFlujoComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: HttpRequestService, useValue: httpSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarFlujoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate home if missing inputs', fakeAsync(() => {
    component.userRepresentation = null as any;
    component.tema = temaMock;
    component.ngOnInit();
    tick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);

    component.userRepresentation = userAlumno;
    component.tema = null as any;
    component.ngOnInit();
    tick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('should open dialog if not alumno and tema not Pendiente', fakeAsync(() => {
    component.userRepresentation = userProfe;
    component.tema = { ...temaMock, estado: 'En trabajo' };
    stubFetches([], [], []);
    component.ngOnInit();
    tick(); tick(); tick();
    expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, jasmine.objectContaining({
      data: jasmine.objectContaining({ message: 'El flujo solo puede ser editado cuando el tema no está en trabajo' })
    }));
  }));

  it('should set guia true if rut matches tema.rut_guia', fakeAsync(() => {
    component.userRepresentation = { ...userAlumno, rut: 'RG1' };
    component.tema = temaMock;
    stubFetches([], [], []);
    component.ngOnInit();
    tick(); tick(); tick();
    expect(component.guia).toBeTrue();
  }));

  it('should load and sort flujoGeneral and fases on init', fakeAsync(() => {
    const flujoList = [{ id: 5 }, { id: 6 }];
    const fasesList = [{ id:1, numero:2 }, { id:2, numero:1 }];
    const subfases = [
      { id:10, id_padre:1, numero:1, nombre:'a', descripcion:'', tipo:'', fecha_inicio:'', fecha_termino:'', rut_creador:'', id_flujo:5 },
      { id:11, id_padre:10, numero:1, nombre:'aa', descripcion:'', tipo:'', fecha_inicio:'', fecha_termino:'', rut_creador:'', id_flujo:5 }
    ];
    httpSpy.getFlujosGenerales.and.returnValue(Promise.resolve(of(flujoList)));
    httpSpy.getFasesFlujo.and.returnValue(Promise.resolve(of(fasesList)));
    httpSpy.getFasesTema.and.returnValue(Promise.resolve(of(subfases)));

    component.userRepresentation = userAlumno;
    component.tema = temaMock;
    component.ngOnInit();
    tick(); // fetchFlujoGeneral
    expect(component.flujoGeneral).toEqual({ id:5 });
    tick(); // fetchFasesFlujo
    expect(component.fasesFlujo.map((f:any)=>f.numero)).toEqual([1,2]);
    tick(); // fetchFasesTema

    const built = component.fasesFlujo.find((f:any)=>f.id===1);
    expect(built.subfases.length).toBe(1);
    expect(built.subfases[0].subfases.length).toBe(1);
  }));

  it('should handle errors in fetches and set loading false', fakeAsync(() => {
    httpSpy.getFlujosGenerales.and.returnValue(Promise.resolve(throwError(() => new Error('e1'))));
    stubFetches([], [], []);
    spyOn(console, 'error');

    component.userRepresentation = userAlumno;
    component.tema = temaMock;
    component.ngOnInit();
    tick();
    expect(console.error).toHaveBeenCalledWith('Error fetching flujo general or fases flujo:', jasmine.any(Error));
    expect(component.loading).toBeFalse();
  }));

  it('should agregarFase and reset popup', () => {
    const fase = { id:123 };
    component.userRepresentation = userProfe;
    component.tema = { ...temaMock, estado:'En trabajo' };
    component.agregarFase(fase);
    expect(dialogSpy.open).toHaveBeenCalled();
    component.userRepresentation = userAlumno;
    component.tema = temaMock;
    component.agregarFase(fase);
    expect(component.id_padre).toBe(123);
    expect(component.agregarFasePopup).toBeTrue();
  });

  it('should closeAgregarFase and refresh data', fakeAsync(() => {
    spyOn(component as any, 'fetchFlujoGeneral').and.returnValue(Promise.resolve());
    spyOn(component as any, 'fetchFasesFlujo').and.returnValue(Promise.resolve());
    spyOn(component as any, 'fetchFasesTema').and.returnValue(Promise.resolve());
    component.closeAgregarFase();
    tick(); tick(); tick();
    expect(component.agregarFasePopup).toBeFalse();
    expect(component.loading).toBeFalse();
  }));

  it('should abrirDetalleFase and fill numeros', () => {
    const fase = { subfases: [ { numero: 7 }, { numero: 8 } ] };
    component.abrirDetalleFase(fase, { id:1 });
    expect(component.showDetalleFase).toBeTrue();
    expect(component.faseSeleccionada).toEqual({ id:1 });
    expect(component.numeros).toEqual([7,8]);
  });

  it('should closeDetalleFase and refresh', fakeAsync(() => {
    spyOn(component as any, 'fetchFlujoGeneral').and.returnValue(Promise.resolve());
    spyOn(component as any, 'fetchFasesFlujo').and.returnValue(Promise.resolve());
    spyOn(component as any, 'fetchFasesTema').and.returnValue(Promise.resolve());
    component.showDetalleFase = true;
    component.faseSeleccionada = { id:1 };
    component.numeros = [1];
    component.closeDetalleFase();
    tick(); tick(); tick();
    expect(component.showDetalleFase).toBeFalse();
    expect(component.faseSeleccionada).toBeNull();
    expect(component.numeros.length).toBe(0);
    expect(component.loading).toBeFalse();
  }));

  it('should toggle subfasesGuia and subfasesAlumno', () => {
    component.subfasesGuia = false;
    component.toggleSubfasesGuia(3);
    expect(component.subfasesGuia).toBeTrue();
    expect(component.faseShowNumero).toBe(3);
    component.subfasesAlumno = false;
    component.toggleSubfasesAlumno(5);
    expect(component.subfasesAlumno).toBeTrue();
    expect(component.subfaseShowNumero).toBe(5);
  });

  function stubFetches(a:any[], b:any[], c:any[]) {
    httpSpy.getFlujosGenerales.and.returnValue(Promise.resolve(of(a)));
    httpSpy.getFasesFlujo.and.returnValue(Promise.resolve(of(b)));
    httpSpy.getFasesTema.and.returnValue(Promise.resolve(of(c)));
  }
});
