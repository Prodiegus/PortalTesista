import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { KeycloakService } from '../keycloak/keycloak.service';
import { authGuard } from './auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let mockKeycloakService: any;
  let mockRouter: any;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

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
    mockState = {} as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: KeycloakService, useValue: mockKeycloakService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should allow navigation if authenticated', async () => {
    const guard = TestBed.runInInjectionContext(() => authGuard);
    const result = await guard(mockRoute, mockState);
    expect(result).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to home if not authenticated', async () => {
    mockKeycloakService.isAuthenticated.and.returnValue(false);
    const guard = TestBed.runInInjectionContext(() => authGuard);
    const result = await guard(mockRoute, mockState);
    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});
