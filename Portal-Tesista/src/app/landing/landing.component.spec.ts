import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import {LandingHeaderComponent} from '../common/landing-header/landing-header.component';
import {LandingBodyComponent} from './landing-body/landing-body.component';
import {FooterComponent} from '../common/footer/footer.component';
import {TablaTemasComponent} from './landing-body/tabla-temas/tabla-temas.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('LandingComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LandingComponent,
        LandingHeaderComponent,
        LandingBodyComponent,
        FooterComponent,
        TablaTemasComponent
      ],
      imports: [
        HttpClientTestingModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

