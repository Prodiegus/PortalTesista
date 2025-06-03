import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarReunionComponent } from './editar-reunion.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule} from '@angular/forms';
import {CONST} from '../const/const';

describe('EditarReunionComponent', () => {
  let component: EditarReunionComponent;
  let fixture: ComponentFixture<EditarReunionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarReunionComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarReunionComponent);
    component = fixture.componentInstance;

    component.userRepresentation = CONST.userRepresentation;
    component.tema = CONST.temas[0];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
