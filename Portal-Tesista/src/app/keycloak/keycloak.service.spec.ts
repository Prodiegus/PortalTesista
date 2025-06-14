import { TestBed } from '@angular/core/testing';
import { KeycloakService } from './keycloak.service';
import { Router } from '@angular/router';

// Falso cliente de Keycloak
class FakeKeycloak {
  authenticated = false;
  token = 'fake-token';
  initReturn = true;
  init = jasmine.createSpy('init').and.callFake(() => Promise.resolve(this.initReturn));
  loadUserProfile = jasmine.createSpy('loadUserProfile').and.returnValue(
    Promise.resolve({ username: 'user1' })
  );
  login = jasmine.createSpy('login');
  logout = jasmine.createSpy('logout').and.returnValue(Promise.resolve());
}

describe('KeycloakService (100 % coverage)', () => {
  let service: KeycloakService;
  let fakeKC: FakeKeycloak;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    fakeKC = new FakeKeycloak();
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        KeycloakService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(KeycloakService);

    // Inyectamos manualmente nuestro fakeKC en la propiedad privada
    (service as any)['_keycloak'] = fakeKC;
  });

  it('debe crearse', () => {
    expect(service).toBeTruthy();
  });

  describe('isInitialized()', () => {
    it('devuelve true cuando _keycloak está presente', () => {
      // _keycloak ya fue inyectado en beforeEach
      expect(service.isInitialized()).toBeTrue();
      // si lo borramos, vuelve a false
      delete (service as any)['_keycloak'];
      expect(service.isInitialized()).toBeFalse();
    });
  });

  describe('init()', () => {
    beforeEach(() => {
      // volvemos a inyectar porque init usará this.keycloak
      (service as any)['_keycloak'] = fakeKC;
    });

    it('cuando initReturn=true carga perfil y token', async () => {
      fakeKC.initReturn = true;
      await service.init();
      expect(fakeKC.init).toHaveBeenCalledWith({
        onLoad: 'login-required',
        pkceMethod: 'S256',
        redirectUri: window.location.origin + '/home'
      });
      expect(fakeKC.loadUserProfile).toHaveBeenCalled();
      expect((service as any)['_profile']).toEqual({
        username: 'user1',
        token: 'fake-token'
      });
    });

    it('cuando initReturn=false no carga perfil', async () => {
      fakeKC.initReturn = false;
      await service.init();
      expect(fakeKC.loadUserProfile).not.toHaveBeenCalled();
      expect(service.profile).toBeUndefined();
    });
  });

  describe('isAuthenticated()', () => {
    it('refleja fakeKC.authenticated', () => {
      fakeKC.authenticated = true;
      expect(service.isAuthenticated()).toBeTrue();
      fakeKC.authenticated = false;
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('login()', () => {
    it('si ya autenticado hace logout+login', () => {
      fakeKC.authenticated = true;
      service.login();
      expect(fakeKC.logout).toHaveBeenCalled();
      expect(fakeKC.login).toHaveBeenCalled();
    });

    it('si no autenticado solo login', () => {
      fakeKC.authenticated = false;
      fakeKC.logout.calls.reset();
      service.login();
      expect(fakeKC.logout).not.toHaveBeenCalled();
      expect(fakeKC.login).toHaveBeenCalled();
    });
  });

  describe('logout()', () => {
    it('pasa redirectUri correcto a keycloak.logout', async () => {
      await service.logout({ redirectUri: 'ignored' });
      expect(fakeKC.logout).toHaveBeenCalledWith({
        redirectUri: window.location.origin
      });
    });
  });

  describe('getter profile', () => {
    it('inicialmente undefined', () => {
      delete (service as any)['_profile'];
      expect(service.profile).toBeUndefined();
    });

    it('tras initReturn=true devuelve perfil', async () => {
      fakeKC.initReturn = true;
      await service.init();
      expect(service.profile).toEqual({
        username: 'user1',
        token: 'fake-token'
      });
    });
  });
});
