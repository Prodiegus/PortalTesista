import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from '../keycloak/keycloak.service';

export const authGuard: CanActivateFn = () => {
  // Obtener dependencias de forma SÍNCRONA primero
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  // Retornar función asíncrona
  return (async () => {
    if (!keycloakService.isInitialized()) {
      await keycloakService.init();
    }

    if (!keycloakService.isAuthenticated()) {
      router.navigate(['']);
      return false;
    }
    return true;
  })();
};
