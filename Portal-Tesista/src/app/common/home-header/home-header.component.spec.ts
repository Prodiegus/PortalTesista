import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHeaderComponent } from './home-header.component';
import {MenuAdminComponent} from '../menu-admin/menu-admin.component';
import {CONST} from '../const/const';

describe('HomeHeaderComponent', () => {
  let component: HomeHeaderComponent;
  let fixture: ComponentFixture<HomeHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeHeaderComponent,
        MenuAdminComponent
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeHeaderComponent);
    component = fixture.componentInstance;

    component.userRepresentation = CONST.userRepresentation;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
