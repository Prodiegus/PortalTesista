import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEscuelaComponent } from './editar-escuela.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule} from '@angular/forms';

describe('EditarEscuelaComponent', () => {
  let component: EditarEscuelaComponent;
  let fixture: ComponentFixture<EditarEscuelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarEscuelaComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarEscuelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
