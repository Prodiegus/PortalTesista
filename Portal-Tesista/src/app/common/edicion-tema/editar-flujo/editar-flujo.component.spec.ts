import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditarFlujoComponent } from './editar-flujo.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { HttpRequestService } from '../../Http-request.service';
import { CONST } from '../../const/const';

describe('EditarFlujoComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: EditarFlujoComponent;
  let fixture: ComponentFixture<EditarFlujoComponent>;
  let router: Router;
  let httpRequestService: jasmine.SpyObj<HttpRequestService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(waitForAsync(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['getCurrentNavigation', 'navigate']);
    routerSpy.getCurrentNavigation.and.returnValue({
      extras: {
        state: {
          userRepresentation: CONST.userRepresentation,
          tema: CONST.temas[0]
        }
      }
    });

    const httpRequestServiceSpy = jasmine.createSpyObj('HttpRequestService', [
      'getFlujosGenerales',
      'getFasesFlujo',
      'getFasesTema'
    ]);

    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      declarations: [EditarFlujoComponent],
      imports: [FormsModule, HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: HttpRequestService, useValue: httpRequestServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarFlujoComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    httpRequestService = TestBed.inject(HttpRequestService) as jasmine.SpyObj<HttpRequestService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /home if userRepresentation is missing', async () => {
    component.userRepresentation = null;
    component.tema = CONST.temas[0];
    await component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to /home if tema is missing', async () => {
    component.tema = null;
    component.userRepresentation = CONST.userRepresentation;
    await component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should load flujo data on ngOnInit', async () => {
    component.userRepresentation = CONST.userRepresentation;
    component.tema = CONST.temas[0];

    httpRequestService.getFlujosGenerales.and.returnValue(Promise.resolve(of([ { id: 1 } ])));
    httpRequestService.getFasesFlujo.and.returnValue(Promise.resolve(of([])));
    httpRequestService.getFasesTema.and.returnValue(Promise.resolve(of([])));

    await component.ngOnInit();
    expect(component.loading).toBeFalse();
    expect(component.flujoGeneral).toEqual({ id: 1 });
  });

  it('should open dialog if user is not alumno and tema is not Pendiente', async () => {
    component.userRepresentation = { ...CONST.userRepresentation, tipo: 'profesor' };
    component.tema = { ...CONST.temas[0], estado: 'En trabajo' };

    httpRequestService.getFlujosGenerales.and.returnValue(Promise.resolve(of([])));
    httpRequestService.getFasesFlujo.and.returnValue(Promise.resolve(of([])));
    httpRequestService.getFasesTema.and.returnValue(Promise.resolve(of([])));

    await component.ngOnInit();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should handle error in fetchFlujoGeneral', async () => {
    component.userRepresentation = CONST.userRepresentation;
    component.tema = CONST.temas[0];

    httpRequestService.getFlujosGenerales.and.returnValue(Promise.resolve(throwError(() => new Error('error'))));
    httpRequestService.getFasesFlujo.and.returnValue(Promise.resolve(of([])));
    httpRequestService.getFasesTema.and.returnValue(Promise.resolve(of([])));

    await component.ngOnInit();
    expect(component.loading).toBeFalse();
  });
});
