import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemaViewComponent } from './tema-view.component';
import { HomeHeaderComponent } from '../../common/home-header/home-header.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { CONST } from '../../common/const/const';
import { TemaSummaryComponent } from '../../common/tema-summary/tema-summary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MenuAdminComponent } from '../../common/menu-admin/menu-admin.component';
import { Router } from '@angular/router';

describe('TemaViewComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: TemaViewComponent;
  let fixture: ComponentFixture<TemaViewComponent>;
  let router: Router;

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
            getCurrentNavigation: jasmine.createSpy('getCurrentNavigation').and.returnValue({
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
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TemaViewComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /home if userRepresentation or tema is missing', () => {
    (router.navigate as jasmine.Spy).calls.reset();

    (component as any).userRepresentation = null;
    (component as any).tema = null;

    component.ngOnInit();

    // Verifica que navigate haya sido llamado con ['/home'].
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should not navigate if userRepresentation and tema are present', () => {
    (router.navigate as jasmine.Spy).calls.reset();

    (component as any).userRepresentation = CONST.userRepresentation;
    (component as any).tema = CONST.temas[0];

    component.ngOnInit();
    // Verifica que navigate NO haya sido llamado.
    expect(router.navigate).not.toHaveBeenCalled();
  });
});

