import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfesoresComponent } from './profesores.component';
import { TablaProfesoresComponent } from './tabla-profesores/tabla-profesores.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FooterComponent } from '../../common/footer/footer.component';
import { MenuAdminComponent } from '../../common/menu-admin/menu-admin.component';
import { Component, Input } from '@angular/core';
import { CONST } from '../../common/const/const';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-header',
  template: '' // Mock template
})
class MockHomeHeaderComponent {
  @Input() userRepresentation: any;
}

describe('ProfesoresComponent', () => {
  let component: ProfesoresComponent;
  let fixture: ComponentFixture<ProfesoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProfesoresComponent,
        MockHomeHeaderComponent, // Use the mock component
        TablaProfesoresComponent,
        FooterComponent,
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
    }).compileComponents();

    fixture = TestBed.createComponent(ProfesoresComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
