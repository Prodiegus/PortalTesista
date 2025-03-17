import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDetalleComponent } from './editar-detalle.component';

describe('EditarDetalleComponent', () => {
  let component: EditarDetalleComponent;
  let fixture: ComponentFixture<EditarDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
