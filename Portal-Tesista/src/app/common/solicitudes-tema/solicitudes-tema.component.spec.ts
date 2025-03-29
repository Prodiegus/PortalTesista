import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesTemaComponent } from './solicitudes-tema.component';

describe('SolicitudesTemaComponent', () => {
  let component: SolicitudesTemaComponent;
  let fixture: ComponentFixture<SolicitudesTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudesTemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
