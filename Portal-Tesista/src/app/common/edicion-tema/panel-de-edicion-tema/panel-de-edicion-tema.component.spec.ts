import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelDeEdicionTemaComponent } from './panel-de-edicion-tema.component';

describe('PanelDeEdicionTemaComponent', () => {
  let component: PanelDeEdicionTemaComponent;
  let fixture: ComponentFixture<PanelDeEdicionTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelDeEdicionTemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelDeEdicionTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
