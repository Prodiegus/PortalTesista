import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioTemaComponent } from './calendario-tema.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('CalendarioTemaComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: CalendarioTemaComponent;
  let fixture: ComponentFixture<CalendarioTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarioTemaComponent],
      imports: [
        HttpClientTestingModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

