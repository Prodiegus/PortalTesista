import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormularioSolicitudTemaComponent } from './formulario-solicitud-tema.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DateFormatPipe } from '../../../pipe/date-format.pipe';
import { HttpRequestService } from '../../../common/Http-request.service';
import { of, throwError } from 'rxjs';

describe('FormularioSolicitudTemaComponent', () => {
  let component: FormularioSolicitudTemaComponent;
  let fixture: ComponentFixture<FormularioSolicitudTemaComponent>;
  let httpSpy: jasmine.SpyObj<HttpRequestService>;

  beforeEach(async () => {
    httpSpy = jasmine.createSpyObj('HttpRequestService', ['getEscuelas','solicitarTema']);
    httpSpy.getEscuelas.and.returnValue(Promise.resolve(of([{ id:1 }])));
    httpSpy.solicitarTema.and.returnValue(Promise.resolve(of({})));

    await TestBed.configureTestingModule({
      declarations: [FormularioSolicitudTemaComponent, DateFormatPipe],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [{ provide: HttpRequestService, useValue: httpSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioSolicitudTemaComponent);
    component = fixture.componentInstance;
    component.tema = { id: 42 };
    (component as any).elementRef = { nativeElement: { contains: () => true } };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit populates escuelas', fakeAsync(() => {
    httpSpy.getEscuelas.and.returnValue(Promise.resolve(of([{ name: 'E' }])));
    component.ngOnInit();
    tick();
    expect(component.escuelas).toEqual([{ name: 'E' }]);
  }));

  it('fetchEscuelas logs on error without uncaught', fakeAsync(() => {
    httpSpy.getEscuelas.and.returnValue(Promise.resolve(throwError(() => 'err')));
    const spy = spyOn(console, 'error');
    
    component.fetchEscuelas().catch(() => {});
    tick();
    
    expect(spy).toHaveBeenCalledWith('Error fetching escuelas');
  }));

  it('solicitarTema logs on error without uncaught', fakeAsync(() => {
    httpSpy.solicitarTema.and.returnValue(Promise.resolve(throwError(() => 'errx')));
    const spy = spyOn(console, 'error');
    
    component.solicitarTema({}).catch(() => {});
    tick();
    
    expect(spy).toHaveBeenCalledWith('Error solicitando tema');
  }));

  it('onSubmit incomplete fields doesn’t call solicitarTema', fakeAsync(() => {
    spyOn(component, 'solicitarTema');
    component.nombre = '';
    component.onSubmit();
    tick();
    expect(component.solicitarTema).not.toHaveBeenCalled();
  }));

  it('onSubmit valid triggers solicitud and closes overlay', fakeAsync(() => {
    spyOn(component, 'solicitarTema').and.returnValue(Promise.resolve());
    spyOn(component, 'closeOverlay');
    component.nombre = 'A'; component.apellido = 'B';
    component.correo = 'c@d'; component.rut='1';
    component.escuela='X'; component.mensaje='M';
    component.onSubmit();
    tick();
    expect(component.solicitarTema).toHaveBeenCalled();
    expect(component.closeOverlay).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  }));

  it('onSubmit handles error gracefully and closes overlay', fakeAsync(() => {
    spyOn(component, 'solicitarTema').and.returnValue(Promise.reject('fail'));
    const spyErr = spyOn(console, 'error');
    const spyClose = spyOn(component, 'closeOverlay');
    component.nombre='A';component.apellido='B';
    component.correo='c@d';component.rut='2';component.escuela='E';component.mensaje='Hi';
    component.onSubmit();
    tick();
    expect(spyErr).toHaveBeenCalledWith('Error solicitando tema');
    expect(spyClose).toHaveBeenCalled();
  }));
});
