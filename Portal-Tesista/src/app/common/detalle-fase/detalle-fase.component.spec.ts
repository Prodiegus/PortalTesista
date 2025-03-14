import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFaseComponent } from './detalle-fase.component';

describe('DetalleFaseComponent', () => {
  let component: DetalleFaseComponent;
  let fixture: ComponentFixture<DetalleFaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleFaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleFaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
