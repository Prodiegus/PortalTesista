import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEscuelaComponent } from './editar-escuela.component';

describe('EditarEscuelaComponent', () => {
  let component: EditarEscuelaComponent;
  let fixture: ComponentFixture<EditarEscuelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarEscuelaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarEscuelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
