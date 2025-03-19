import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionTemaComponent } from './edicion-tema.component';

describe('EdicionTemaComponent', () => {
  let component: EdicionTemaComponent;
  let fixture: ComponentFixture<EdicionTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EdicionTemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicionTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
