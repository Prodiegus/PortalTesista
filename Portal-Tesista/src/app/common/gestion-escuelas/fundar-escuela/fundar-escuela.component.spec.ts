import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundarEscuelaComponent } from './fundar-escuela.component';

describe('FundarEscuelaComponent', () => {
  let component: FundarEscuelaComponent;
  let fixture: ComponentFixture<FundarEscuelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundarEscuelaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundarEscuelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
