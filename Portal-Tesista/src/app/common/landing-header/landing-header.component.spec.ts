import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingHeaderComponent } from './landing-header.component';

describe('LandingHeaderComponent', () => {
  let component: LandingHeaderComponent;
  let fixture: ComponentFixture<LandingHeaderComponent>;
  let mockKeycloakService: any;

  beforeEach(async () => {
    mockKeycloakService = {
      init: jasmine.createSpy('init').and.returnValue(Promise.resolve()),
      login: jasmine.createSpy('login').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      declarations: [LandingHeaderComponent],
      providers: [
        { provide: 'KeycloakService', useValue: mockKeycloakService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingHeaderComponent);
    component = fixture.componentInstance;
    // Inyectar el mock si es necesario
    (component as any).keycloakService = mockKeycloakService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call keycloakService.init and login, and set loading correctly', async () => {
    component.loading = false;
    await component.goHome();
    expect(component.loading).toBeFalse();
    expect(mockKeycloakService.init).toHaveBeenCalled();
    expect(mockKeycloakService.login).toHaveBeenCalled();
  });
});