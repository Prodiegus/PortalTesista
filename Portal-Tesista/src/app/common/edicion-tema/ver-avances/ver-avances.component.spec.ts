import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAvancesComponent } from './ver-avances.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('VerAvancesComponent', () => {
  let component: VerAvancesComponent;
  let fixture: ComponentFixture<VerAvancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerAvancesComponent],
      imports: [
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerAvancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
