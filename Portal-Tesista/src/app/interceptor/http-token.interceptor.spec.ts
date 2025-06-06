import { TestBed } from '@angular/core/testing';
import { HttpTokenInterceptor } from './http-token.interceptor';
import { KeycloakService } from '../keycloak/keycloak.service';

describe('HttpTokenInterceptorService', () => {
  let service: HttpTokenInterceptor;
  let mockKeycloakService: any;

  beforeEach(() => {
    // Crear un mock para KeycloakService
    mockKeycloakService = {
      keycloak: {
        token: 'mock-token' // Token simulado
      }
    };

    TestBed.configureTestingModule({
      providers: [
        HttpTokenInterceptor,
        { provide: KeycloakService, useValue: mockKeycloakService } // Proveer el mock
      ]
    });

    service = TestBed.inject(HttpTokenInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add Authorization header with Bearer token', () => {
    let capturedHeaders: any;
    const request = {
      clone: jasmine.createSpy('clone').and.callFake((req) => {
        capturedHeaders = req.headers;
        return req;
      })
    };
    const next = {
      handle: jasmine.createSpy('handle').and.returnValue({})
    };
  
    service.intercept(request as any, next as any);
  
    expect(request.clone).toHaveBeenCalled();
    expect(capturedHeaders.get('Authorization')).toBe('Bearer mock-token');
    expect(next.handle).toHaveBeenCalled();
  });
});
