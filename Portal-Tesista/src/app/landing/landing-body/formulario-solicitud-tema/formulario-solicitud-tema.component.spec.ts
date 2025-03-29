import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioSolicitudTemaComponent } from './formulario-solicitud-tema.component';

describe('FormularioSolicitudTemaComponent', () => {
  let component: FormularioSolicitudTemaComponent;
  let fixture: ComponentFixture<FormularioSolicitudTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioSolicitudTemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioSolicitudTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
