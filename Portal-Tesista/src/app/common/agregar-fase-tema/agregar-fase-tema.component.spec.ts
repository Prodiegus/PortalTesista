import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarFaseTemaComponent } from './agregar-fase-tema.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule} from '@angular/forms';

describe('AgregarFaseTemaComponent', () => {
  let component: AgregarFaseTemaComponent;
  let fixture: ComponentFixture<AgregarFaseTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarFaseTemaComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarFaseTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
