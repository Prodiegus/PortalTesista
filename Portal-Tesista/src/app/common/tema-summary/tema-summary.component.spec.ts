import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemaSummaryComponent } from './tema-summary.component';

describe('TemaSummaryComponent', () => {
  let component: TemaSummaryComponent;
  let fixture: ComponentFixture<TemaSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemaSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemaSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
