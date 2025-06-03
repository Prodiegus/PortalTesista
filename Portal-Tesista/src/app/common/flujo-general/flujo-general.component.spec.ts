import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlujoGeneralComponent } from './flujo-general.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('FlujoGeneralComponent', () => {
  let component: FlujoGeneralComponent;
  let fixture: ComponentFixture<FlujoGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlujoGeneralComponent],
      imports: [
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlujoGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
