import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from '../keycloak/keycloak.service';

export const authGuard: CanActivateFn = async () => {
  const keycloakService = inject(KeycloakService);
  const router: Router = inject(Router);

  if (!keycloakService.isInitialized()) {
    await keycloakService.init();
  }

  if (!keycloakService.isAuthenticated()) {
    router.navigate(['']);
    return false;
  }
  return true;
}
