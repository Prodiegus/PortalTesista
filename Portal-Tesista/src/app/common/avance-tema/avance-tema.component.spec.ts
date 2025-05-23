import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvanceTemaComponent } from './avance-tema.component';

describe('AvanceTemaComponent', () => {
  let component: AvanceTemaComponent;
  let fixture: ComponentFixture<AvanceTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvanceTemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvanceTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
