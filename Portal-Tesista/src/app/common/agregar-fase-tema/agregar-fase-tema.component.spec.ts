import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarFaseTemaComponent } from './agregar-fase-tema.component';

describe('AgregarFaseTemaComponent', () => {
  let component: AgregarFaseTemaComponent;
  let fixture: ComponentFixture<AgregarFaseTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarFaseTemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarFaseTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
