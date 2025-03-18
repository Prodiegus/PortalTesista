import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemaPopupComponent } from './tema-popup.component';

describe('TemaPopupComponent', () => {
  let component: TemaPopupComponent;
  let fixture: ComponentFixture<TemaPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemaPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
