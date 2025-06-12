import { TestBed } from '@angular/core/testing';

import { KeycloakAuthService } from './keycloak-auth.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('KeycloakAuthService', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let service: KeycloakAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(KeycloakAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

