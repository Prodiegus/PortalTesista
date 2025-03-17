import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDuenosComponent } from './editar-duenos.component';

describe('EditarDuenosComponent', () => {
  let component: EditarDuenosComponent;
  let fixture: ComponentFixture<EditarDuenosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarDuenosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarDuenosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
