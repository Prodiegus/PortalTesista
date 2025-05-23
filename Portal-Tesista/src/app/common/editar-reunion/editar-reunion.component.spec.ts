import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarReunionComponent } from './editar-reunion.component';

describe('EditarReunionComponent', () => {
  let component: EditarReunionComponent;
  let fixture: ComponentFixture<EditarReunionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarReunionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarReunionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
