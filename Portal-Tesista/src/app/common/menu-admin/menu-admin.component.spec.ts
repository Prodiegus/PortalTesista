import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAdminComponent } from './menu-admin.component';
import {CONST} from '../const/const';

describe('MenuAdminComponent', () => {
  let component: MenuAdminComponent;
  let fixture: ComponentFixture<MenuAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuAdminComponent);
    component = fixture.componentInstance;

    component.userRepresentation = CONST.userRepresentation;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
