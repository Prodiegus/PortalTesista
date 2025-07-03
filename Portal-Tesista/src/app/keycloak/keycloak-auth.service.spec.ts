import { TestBed } from '@angular/core/testing';
import { KeycloakAuthService } from './keycloak-auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../enviroments/enviroment';

describe('KeycloakAuthService', () => {
  let service: KeycloakAuthService;
  let httpMock: HttpTestingController;

  const tokenEndpoint = `${environment.keycloak.url}/realms/${environment.keycloak.realm}/protocol/openid-connect/token`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KeycloakAuthService]
    });

    service = TestBed.inject(KeycloakAuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Se asegura de que no queden peticiones pendientes
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('authenticateClient() debe llamar POST con headers y body correctos', () => {
    // Llamada al método
    service.authenticateClient().subscribe(response => {
      // stub de respuesta, no se usa aquí
      expect(response).toEqual({ access_token: 'ok' });
    });

    // Capturamos la petición
    const req = httpMock.expectOne(tokenEndpoint);
    expect(req.request.method).toBe('POST');

    // Comprobamos cabeceras
    expect(req.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');

    // El body viene serializado como string
    const bodyString = req.request.body as string;
    const params = new URLSearchParams(bodyString);
    expect(params.get('client_id')).toBe(environment.keycloak.clientId);
    expect(params.get('grant_type')).toBe('client_credentials');

    // Respondemos con un token simulado
    req.flush({ access_token: 'ok' });
  });

  it('authenticateClient() debe propagar error en caso de fallo', () => {
    let errorResponse: any;
    service.authenticateClient().subscribe({
      next: () => fail('No debe llegar al next en caso de error'),
      error: err => errorResponse = err
    });

    const req = httpMock.expectOne(tokenEndpoint);
    req.flush({ message: 'fail' }, { status: 500, statusText: 'Server Error' });

    expect(errorResponse.status).toBe(500);
    expect(errorResponse.statusText).toBe('Server Error');
  });
});
