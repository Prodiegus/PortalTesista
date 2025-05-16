import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEscuelasComponent } from './gestion-escuelas.component';

describe('GestionEscuelasComponent', () => {
  let component: GestionEscuelasComponent;
  let fixture: ComponentFixture<GestionEscuelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionEscuelasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionEscuelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
