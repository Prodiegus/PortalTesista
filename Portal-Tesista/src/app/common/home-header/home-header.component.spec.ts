import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeHeaderComponent } from './home-header.component';
import { MenuAdminComponent } from '../menu-admin/menu-admin.component';
import { Router } from '@angular/router';
import { CONST } from '../const/const';

describe('HomeHeaderComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: HomeHeaderComponent;
  let fixture: ComponentFixture<HomeHeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeHeaderComponent,
        MenuAdminComponent
      ],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeHeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    component.userRepresentation = CONST.userRepresentation;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /home when goHome is called', () => {
    component.goHome();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});

