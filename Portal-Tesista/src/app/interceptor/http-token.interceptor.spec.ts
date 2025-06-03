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
});
