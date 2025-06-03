import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarTemaComponent } from './agregar-tema.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule} from '@angular/forms';

describe('AgregarTemaComponent', () => {
  let component: AgregarTemaComponent;
  let fixture: ComponentFixture<AgregarTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarTemaComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
