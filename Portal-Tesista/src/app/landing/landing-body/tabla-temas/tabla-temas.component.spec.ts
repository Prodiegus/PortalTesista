import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablaTemasComponent } from './tabla-temas.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';
import { CONST } from '../../../common/const/const';

describe('TablaTemasComponent', () => {
  let component: TablaTemasComponent;
  let fixture: ComponentFixture<TablaTemasComponent>;
  let mockHttpRequestService: any;

  const temasMock = [
    {
      id: 1,
      titulo: 'Tema 1',
      resumen: 'Resumen 1',
      estado: 'Activo',
      numero_fase: 1,
      id_fase: 1,
      nombre_escuela: 'Escuela 1',
      rut_guia: '123',
      guia: 'Guía 1',
      co_guias: ['CoGuía 1'],
      creacion: '2024-01-01'
    }
  ];

  beforeEach(async () => {
    mockHttpRequestService = {
      getTemas: jasmine.createSpy('getTemas').and.returnValue(
        Promise.resolve(of(CONST.temas))
      )
    };

    await TestBed.configureTestingModule({
      declarations: [TablaTemasComponent],
      imports: [HttpClientTestingModule, MatTableModule],
      providers: [
        { provide: 'HttpRequestService', useValue: mockHttpRequestService }
      ]
    }).overrideComponent(TablaTemasComponent, {
      set: {
        providers: [
          { provide: 'HttpRequestService', useValue: mockHttpRequestService }
        ]
      }
    }).compileComponents();
    fixture = TestBed.createComponent(TablaTemasComponent);
    component = fixture.componentInstance;

    // Mock paginator and sort
    component.paginator = {} as MatPaginator;
    component.sort = {} as MatSort;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should fetch temas on init', async () => {
    await component.ngOnInit();
    await fixture.whenStable(); // Espera a que se resuelvan los observables/promesas
    fixture.detectChanges();  // Actualiza el componente
    const length = CONST.temas.length;
    expect(mockHttpRequestService.getTemas).toHaveBeenCalled();
    expect((component as any).temas.length).toBe(length);
    expect(component.dataSource.data.length).toBe(length);
    expect(component.loading).toBeFalse();
  });

  it('should filter temas', () => {
    component.dataSource.data = temasMock;
    const event = { target: { value: 'Tema 1' } } as any;
    component.applyFilter(event);
    expect(component.dataSource.filter).toBe('tema 1');
  });

  it('should open and close detalle', () => {
    component.detalleTema(temasMock[0]);
    expect((component as any).detalle).toBeTrue();
    component.detalleTemaClose();
    expect((component as any).detalle).toBeFalse();
  });

  it('should open and close formulario', () => {
    component.solicitarTema();
    expect((component as any).formulario).toBeTrue();
    component.solicitarTemaClose();
    expect((component as any).formulario).toBeFalse();
  });

});