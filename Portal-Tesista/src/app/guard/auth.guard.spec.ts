import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { KeycloakService } from '../keycloak/keycloak.service';
import { authGuard } from './auth.guard';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('authGuard', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let mockKeycloakService: any;
  let mockRouter: any;
  let mockRoute: ActivatedRouteSnapshot;

  beforeEach(() => {
    mockKeycloakService = {
      isInitialized: jasmine.createSpy('isInitialized').and.returnValue(true),
      isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
      init: jasmine.createSpy('init').and.returnValue(Promise.resolve())
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockRoute = {} as ActivatedRouteSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: KeycloakService, useValue: mockKeycloakService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should allow navigation if authenticated', async () => {
    const result = await TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, {} as any)
    );
    expect(result).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to home if not authenticated', async () => {
    mockKeycloakService.isAuthenticated.and.returnValue(false);
    const result = await TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, {} as any)
    );
    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should initialize Keycloak if not initialized', async () => {
    mockKeycloakService.isInitialized.and.returnValue(false);
    await TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, {} as any)
    );
    expect(mockKeycloakService.init).toHaveBeenCalled();
  });
});

