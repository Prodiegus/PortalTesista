import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearReunionComponent } from './crear-reunion.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule} from '@angular/forms';

describe('CrearReunionComponent', () => {
  let component: CrearReunionComponent;
  let fixture: ComponentFixture<CrearReunionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearReunionComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearReunionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
