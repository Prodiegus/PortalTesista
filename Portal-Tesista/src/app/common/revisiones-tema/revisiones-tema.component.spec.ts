import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionesTemaComponent } from './revisiones-tema.component';

describe('RevisionesTemaComponent', () => {
  let component: RevisionesTemaComponent;
  let fixture: ComponentFixture<RevisionesTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevisionesTemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevisionesTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
