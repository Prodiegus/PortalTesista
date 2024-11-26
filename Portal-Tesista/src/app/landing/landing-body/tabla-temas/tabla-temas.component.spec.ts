import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaTemasComponent } from './tabla-temas.component';

describe('TablaTemasComponent', () => {
  let component: TablaTemasComponent;
  let fixture: ComponentFixture<TablaTemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TablaTemasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaTemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
