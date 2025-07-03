import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemaSummaryComponent } from './tema-summary.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CONST } from '../const/const';
import { of, throwError } from 'rxjs';
import { HttpRequestService } from '../Http-request.service';

describe('TemaSummaryComponent', () => {
  let component: TemaSummaryComponent;
  let fixture: ComponentFixture<TemaSummaryComponent>;
  let mockRouter: any;
  let mockHttpRequestService: any;

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  beforeEach(async () => {
    mockRouter = {
      getCurrentNavigation: () => ({
        extras: {
          state: {
            userRepresentation: CONST.userRepresentation,
            tema: CONST.temas[0]
          }
        }
      }),
      navigate: jasmine.createSpy('navigate')
    };

    mockHttpRequestService = {
      getResumenTema: jasmine.createSpy().and.returnValue(
        Promise.resolve(
          of({ avance: '85%', otroCampo: 'valor' })
        )
      ),
      faseSiguiente: jasmine.createSpy().and.returnValue(Promise.resolve(of({ resultado: 'ok' }))),
      faseAnterior: jasmine.createSpy().and.returnValue(Promise.resolve(of({ resultado: 'ok' })))
    };

    await TestBed.configureTestingModule({
      declarations: [TemaSummaryComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: HttpRequestService, useValue: mockHttpRequestService }
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TemaSummaryComponent);
    component = fixture.componentInstance;

    component.userRepresentation = CONST.userRepresentation;
    component.tema = CONST.temas[0];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch resumen on init', async () => {
    spyOn(component, 'fetchResumenTema').and.callThrough();

    await component.ngOnInit();

    expect(component.fetchResumenTema).toHaveBeenCalled();
    expect(component.resumen).toEqual(jasmine.objectContaining({ avance: '85%', otroCampo: 'valor' }));
  });

  it('should call router.navigate on edicionTema', () => {
    component.edicionTema();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/home/editar-tema', component.tema.id],
      {
        state: {
          tema: component.tema,
          userRepresentation: component.userRepresentation
        }
      }
    );
  });

  it('should handle faseSiguiente and update resumen', async () => {
    spyOn(component, 'fetchResumenTema').and.callThrough();
    await component.faseSiguiente();
    expect(mockHttpRequestService.faseSiguiente).toHaveBeenCalledWith(component.tema.id);
    expect(component.fetchResumenTema).toHaveBeenCalled();
  });

  it('should handle faseAnterior and update resumen', async () => {
    spyOn(component, 'fetchResumenTema').and.callThrough();
    await component.faseAnterior();
    expect(mockHttpRequestService.faseAnterior).toHaveBeenCalledWith(component.tema.id);
    expect(component.fetchResumenTema).toHaveBeenCalled();
  });

  it('should handle error in fetchResumenTema', async () => {
    mockHttpRequestService.getResumenTema.and.returnValue(
      Promise.resolve(throwError(() => new Error('Error de red')))
    );

    const consoleSpy = spyOn(console, 'error');
    await component.fetchResumenTema().catch(() => {});
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching resumen tema');
  });
});
