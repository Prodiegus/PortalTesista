import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpResponse
} from '@angular/common/http';
import { of } from 'rxjs';

@Injectable()
export class MockKeycloakInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Intercepta peticiones a Keycloak
    if (req.url.includes('keycloak.portaltesista.me')) {
      return of(new HttpResponse({ 
        status: 200, 
        body: {
          access_token: 'mock-token',
          expires_in: 300,
          refresh_token: 'mock-refresh-token'
        }
      }));
    }
    return next.handle(req);
  }
}