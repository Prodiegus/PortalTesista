import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemasViewComponent } from './temas-view.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TemasViewComponent', () => {
  let component: TemasViewComponent;
  let fixture: ComponentFixture<TemasViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemasViewComponent],
      imports: [
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemasViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
