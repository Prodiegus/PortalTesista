import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarFlujoComponent } from './editar-flujo.component';

describe('EditarFlujoComponent', () => {
  let component: EditarFlujoComponent;
  let fixture: ComponentFixture<EditarFlujoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarFlujoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarFlujoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
