import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoGuiasComponent } from './co-guias.component';

describe('CoGuiasComponent', () => {
  let component: CoGuiasComponent;
  let fixture: ComponentFixture<CoGuiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoGuiasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoGuiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
