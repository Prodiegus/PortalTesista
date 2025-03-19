import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioTemaComponent } from './calendario-tema.component';

describe('CalendarioTemaComponent', () => {
  let component: CalendarioTemaComponent;
  let fixture: ComponentFixture<CalendarioTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarioTemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
