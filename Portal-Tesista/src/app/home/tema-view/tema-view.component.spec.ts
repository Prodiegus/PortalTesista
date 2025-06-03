import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemaViewComponent } from './tema-view.component';
import {HomeHeaderComponent} from '../../common/home-header/home-header.component';
import {FooterComponent} from '../../common/footer/footer.component';
import {CONST} from '../../common/const/const';
import {TemaSummaryComponent} from '../../common/tema-summary/tema-summary.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MenuAdminComponent} from '../../common/menu-admin/menu-admin.component';
import {Router} from '@angular/router';

describe('TemaViewComponent', () => {
  let component: TemaViewComponent;
  let fixture: ComponentFixture<TemaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TemaViewComponent,
        HomeHeaderComponent,
        FooterComponent,
        TemaSummaryComponent,
        MenuAdminComponent
      ],
      providers: [
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => ({
              extras: {
                state: {
                  userRepresentation: CONST.userRepresentation,
                  tema: CONST.temas[0]
                }
              }
            }),
            navigate: jasmine.createSpy('navigate')
          }
        }
      ],
      imports: [
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemaViewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
