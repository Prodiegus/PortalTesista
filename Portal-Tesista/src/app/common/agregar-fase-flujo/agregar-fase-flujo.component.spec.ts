import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarFaseFlujoComponent } from './agregar-fase-flujo.component';

describe('AgregarFaseFlujoComponent', () => {
  let component: AgregarFaseFlujoComponent;
  let fixture: ComponentFixture<AgregarFaseFlujoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarFaseFlujoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarFaseFlujoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
