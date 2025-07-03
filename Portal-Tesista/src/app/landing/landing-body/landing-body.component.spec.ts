import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingBodyComponent } from './landing-body.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TablaTemasComponent} from './tabla-temas/tabla-temas.component';

describe('LandingBodyComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: LandingBodyComponent;
  let fixture: ComponentFixture<LandingBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LandingBodyComponent,
        TablaTemasComponent
      ],
      imports: [
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

