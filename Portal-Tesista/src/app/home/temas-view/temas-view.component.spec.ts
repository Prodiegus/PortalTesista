import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemasViewComponent } from './temas-view.component';

describe('TemasViewComponent', () => {
  let component: TemasViewComponent;
  let fixture: ComponentFixture<TemasViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemasViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemasViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
