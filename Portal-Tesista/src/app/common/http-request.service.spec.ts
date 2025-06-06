import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { 
  HttpClientTestingModule, 
  HttpTestingController 
} from '@angular/common/http/testing';
import { HttpRequestService } from './Http-request.service';
import { environment } from '../../enviroments/enviroment';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

describe('HttpRequestService', () => {
  let service: HttpRequestService;
  let httpMock: HttpTestingController;
  const apiUrl = environment['api-portal-tesista'].url;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpRequestService]
    });
    
    service = TestBed.inject(HttpRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Función auxiliar para pruebas HTTP
  const testHttpCall = (
    methodCall: (data?: any) => Promise<Observable<any>>,
    url: string,
    method: string,
    mockData: any,
    callData?: any
  ) => {
    return fakeAsync(() => {
      let actualResponse: any;
      
      // Ejecutar el método del servicio
      const promise = methodCall.call(service, callData);
      
      promise.then(observable => {
        observable.subscribe(res => {
          actualResponse = res;
        });
      });

      // Procesar la promesa
      tick();

      // Interceptar la solicitud
      const req = httpMock.expectOne(url);
      
      // Verificar el método HTTP
      expect(req.request.method).toBe(method);
      
      // Verificar el cuerpo si es necesario
      if (method !== 'GET') {
        expect(req.request.body).toEqual(callData || mockData);
      }
      
      // Simular la respuesta
      req.flush(mockData);
      
      // Procesar la respuesta
      tick();
      
      // Verificar la respuesta
      expect(actualResponse).toEqual(mockData);
    });
  };

  // Prueba para getUsuarios
  it('getUsuarios should make GET request', () => {
    return testHttpCall(
      service.getUsuarios,
      `${apiUrl}/read/allUser`,
      'GET',
      [{id: 1, name: 'Test User'}]
    )();
  });

  // Prueba para editarUsuario
  it('editarUsuario should make POST request', () => {
    const usuario = {id: 1, name: 'Updated User'};
    return testHttpCall(
      service.editarUsuario,
      `${apiUrl}/update/user`,
      'POST',
      {success: true},
      usuario
    )();
  });

  // Prueba para getEscuelas
  it('getEscuelas should make GET request', () => {
    return testHttpCall(
      service.getEscuelas,
      `${apiUrl}/read/schools`,
      'GET',
      [{id: 1, name: 'Engineering'}]
    )();
  });

  // Prueba para crearEscuela
  it('crearEscuela should make POST request', () => {
    const escuela = {name: 'New School'};
    return testHttpCall(
      service.crearEscuela,
      `${apiUrl}/create/school`,
      'POST',
      {id: 2},
      escuela
    )();
  });

  // Prueba para editarEscuela
  it('editarEscuela should make POST request', () => {
    const escuela = {id: 1, name: 'Updated School'};
    return testHttpCall(
      service.editarEscuela,
      `${apiUrl}/edit/school`,
      'POST',
      {success: true},
      escuela
    )();
  });

  // Prueba especial para getUserData con header
  it('getUserData should include Authorization header', fakeAsync(() => {
    const token = 'test-token';
    const mockResponse = {user: 'data'};
    let actualResponse: any;
    
    service.getUserData(token).then(observable => {
      observable.subscribe(response => {
        actualResponse = response;
      });
    });

    tick();

    const req = httpMock.expectOne(`${apiUrl}/read/user`);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(mockResponse);
    
    tick();
    
    expect(actualResponse).toEqual(mockResponse);
  }));

  // Prueba para getProfesores
  it('getProfesores should make GET request', () => {
    const escuela = 'Engineering';
    return testHttpCall(
      service.getProfesores,
      `${apiUrl}/read/allUser/${escuela}`,
      'GET',
      [{name: 'Professor'}],
      escuela
    )();
  });

  // Prueba para addDocente
  it('addDocente should make POST request', () => {
    const docente = {name: 'New Teacher'};
    return testHttpCall(
      service.addDocente,
      `${apiUrl}/create/user`,
      'POST',
      {success: true},
      docente
    )();
  });

  // Prueba para desactivarDocente
  it('desactivarDocente should make POST request', () => {
    const docente = {id: 1};
    return testHttpCall(
      service.desactivarDocente,
      `${apiUrl}/disable/user`,
      'POST',
      {status: 'inactive'},
      docente
    )();
  });

  // Prueba para activarDocente
  it('activarDocente should make POST request', () => {
    const docente = {id: 1};
    return testHttpCall(
      service.activarDocente,
      `${apiUrl}/enable/user`,
      'POST',
      {status: 'active'},
      docente
    )();
  });

  // Prueba para getFlujosGenerales
  it('getFlujosGenerales should make GET request', () => {
    const escuela = 'Science';
    return testHttpCall(
      service.getFlujosGenerales,
      `${apiUrl}/read/work-flow/escuela/${escuela}`,
      'GET',
      [{id: 1, name: 'Workflow'}],
      escuela
    )();
  });

  // Prueba para getFasesTema
  it('getFasesTema should make GET request', () => {
    const idTema = 123;
    return testHttpCall(
      service.getFasesTema,
      `${apiUrl}/read/topic-phase/${idTema}`,
      'GET',
      [{phase: 'Phase 1'}],
      idTema
    )();
  });

  // Prueba para addFasesTema
  it('addFasesTema should make POST request', () => {
    const fase = {topicId: 1, phase: 'New Phase'};
    return testHttpCall(
      service.addFasesTema,
      `${apiUrl}/create/subphase`,
      'POST',
      {id: 2},
      fase
    )();
  });

  // Prueba para getFasesFlujo
  it('getFasesFlujo should make GET request', () => {
    const id = 456;
    return testHttpCall(
      service.getFasesFlujo,
      `${apiUrl}/read/work-flow/phase/${id}`,
      'GET',
      [{id: 1, name: 'Flow Phase'}],
      id
    )();
  });

  // Prueba para addFaseFlujo
  it('addFaseFlujo should make POST request', () => {
    const faseFlujo = {workflowId: 1, name: 'New Flow Phase'};
    return testHttpCall(
      service.addFaseFlujo,
      `${apiUrl}/create/phase`,
      'POST',
      {success: true},
      faseFlujo
    )();
  });

  // Prueba para editFaseFlujo
  it('editFaseFlujo should make POST request', () => {
    const faseFlujo = {id: 1, name: 'Updated Phase'};
    return testHttpCall(
      service.editFaseFlujo,
      `${apiUrl}/edit/phase`,
      'POST',
      {updated: true},
      faseFlujo
    )();
  });

  // Prueba especial para deleteFaseFlujo (DELETE con body)
  it('deleteFaseFlujo should make DELETE request with body', fakeAsync(() => {
    const faseFlujo = {id: 1};
    const mockResponse = {success: true};
    let actualResponse: any;
    
    service.deleteFaseFlujo(faseFlujo).then(observable => {
      observable.subscribe(response => {
        actualResponse = response;
      });
    });

    tick();

    const req = httpMock.expectOne(`${apiUrl}/delete/phase`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(JSON.stringify(faseFlujo));
    req.flush(mockResponse);
    
    tick();
    
    expect(actualResponse).toEqual(mockResponse);
  }));

  // Prueba para getTemas
  it('getTemas should make GET request', () => {
    return testHttpCall(
      service.getTemas,
      `${apiUrl}/read/topic`,
      'GET',
      [{id: 1, title: 'Topic 1'}]
    )();
  });

  // Prueba para getTemasUsuario
  it('getTemasUsuario should make GET request', () => {
    const rut = '12345678-9';
    return testHttpCall(
      service.getTemasUsuario,
      `${apiUrl}/read/topic/${rut}`,
      'GET',
      [{id: 1, title: 'User Topic'}],
      rut
    )();
  });

  // Prueba para getTemasRevisionUsuario
  it('getTemasRevisionUsuario should make GET request', () => {
    const rut = '12345678-9';
    return testHttpCall(
      service.getTemasRevisionUsuario,
      `${apiUrl}/read/review/topic/${rut}`,
      'GET',
      [{id: 1, title: 'Review Topic'}],
      rut
    )();
  });

  // Prueba para addTema
  it('addTema should make POST request', () => {
    const tema = {title: 'New Topic', description: 'Test'};
    return testHttpCall(
      service.addTema,
      `${apiUrl}/create/topic`,
      'POST',
      {id: 2},
      tema
    )();
  });

  // Prueba para editTema
  it('editTema should make POST request', () => {
    const tema = {id: 1, title: 'Updated Topic'};
    return testHttpCall(
      service.editTema,
      `${apiUrl}/edit/topic`,
      'POST',
      {success: true},
      tema
    )();
  });

  // Prueba para cambiarEstadoTema
  it('cambiarEstadoTema should make POST request', () => {
    const tema = {id: 1, estado: 'Aprobado'};
    return testHttpCall(
      service.cambiarEstadoTema,
      `${apiUrl}/change/topic-status`,
      'POST',
      {statusChanged: true},
      tema
    )();
  });

  // Prueba para solicitarTema
  it('solicitarTema should make POST request', () => {
    const tema = {id: 1, student: 'Student Name'};
    return testHttpCall(
      service.solicitarTema,
      `${apiUrl}/request/topic`,
      'POST',
      {requested: true},
      tema
    )();
  });

  // Prueba para aceptarTema
  it('aceptarTema should make POST request', () => {
    const tema = {id: 1};
    return testHttpCall(
      service.aceptarTema,
      `${apiUrl}/accept/topic`,
      'POST',
      {accepted: true},
      tema
    )();
  });

  // Prueba para getSolicitudes
  it('getSolicitudes should make GET request', () => {
    const idTema = 789;
    return testHttpCall(
      service.getSolicitudes,
      `${apiUrl}/read/topic-request/${idTema}`,
      'GET',
      [{id: 1, student: 'Student 1'}],
      idTema
    )();
  });

  // Prueba para subirAvance
  it('subirAvance should make POST request', () => {
    const avance = {topicId: 1, file: 'file.pdf'};
    return testHttpCall(
      service.subirAvance,
      `${apiUrl}/upload/preview`,
      'POST',
      {uploaded: true},
      avance
    )();
  });

  // Prueba para getAvancesTema
  it('getAvancesTema should make GET request', () => {
    const idTema = 101;
    return testHttpCall(
      service.getAvancesTema,
      `${apiUrl}/read/preview/${idTema}`,
      'GET',
      [{id: 1, name: 'Progress 1'}],
      idTema
    )();
  });

  // Prueba para getUltimoAvanceTema
  it('getUltimoAvanceTema should make GET request', () => {
    const idTema = 101;
    return testHttpCall(
      service.getUltimoAvanceTema,
      `${apiUrl}/read/latest/preview/${idTema}`,
      'GET',
      {id: 1, name: 'Latest Progress'},
      idTema
    )();
  });

  // Prueba para getRevisoresTema
  it('getRevisoresTema should make GET request', () => {
    const idTema = 101;
    return testHttpCall(
      service.getRevisoresTema,
      `${apiUrl}/read/reviewer/${idTema}`,
      'GET',
      [{id: 1, name: 'Reviewer'}],
      idTema
    )();
  });

  // Prueba para addRevisor
  it('addRevisor should make POST request', () => {
    const revisor = {topicId: 1, reviewerId: 2};
    return testHttpCall(
      service.addRevisor,
      `${apiUrl}/add/reviewer`,
      'POST',
      {added: true},
      revisor
    )();
  });

  // Prueba para borrarRevisor
  it('borrarRevisor should make POST request', () => {
    const revisor = {topicId: 1, reviewerId: 2};
    return testHttpCall(
      service.borrarRevisor,
      `${apiUrl}/delete/reviewer`,
      'POST',
      {deleted: true},
      revisor
    )();
  });

  // Prueba para empezarRevisionAvance
  it('empezarRevisionAvance should make POST request', () => {
    const avance = {id: 1};
    return testHttpCall(
      service.empezarRevisionAvance,
      `${apiUrl}/start/review`,
      'POST',
      {started: true},
      avance
    )();
  });

  // Prueba para calificarAvance
  it('calificarAvance should make POST request', () => {
    const calificacion = {reviewId: 1, grade: 90};
    return testHttpCall(
      service.calificarAvance,
      `${apiUrl}/grade/review`,
      'POST',
      {graded: true},
      calificacion
    )();
  });

  // Prueba para faseSiguiente
  xit('faseSiguiente should make POST request', () => {
    const idTema = 202;
    return testHttpCall(
      service.faseSiguiente,
      `${apiUrl}/move/phase/forward/${idTema}`,
      'POST',
      {moved: true},
      idTema
    )();
  });

  // Prueba para faseAnterior
  xit('faseAnterior should make POST request', () => {
    const idTema = 202;
    return testHttpCall(
      service.faseAnterior,
      `${apiUrl}/move/phase/backward/${idTema}`,
      'POST',
      {moved: true},
      idTema
    )();
  });

  // Prueba para crearReuniones
  it('crearReuniones should make POST request', () => {
    const reunion = {topicId: 1, date: '2023-01-01'};
    return testHttpCall(
      service.crearReuniones,
      `${apiUrl}/create/meeting`,
      'POST',
      {created: true},
      reunion
    )();
  });

  // Prueba para getReuniones
  it('getReuniones should make GET request', () => {
    const idTema = 303;
    return testHttpCall(
      service.getReuniones,
      `${apiUrl}/read/meeting/${idTema}`,
      'GET',
      [{id: 1, date: '2023-01-01'}],
      idTema
    )();
  });

  // Prueba para editarReunion
  it('editarReunion should make POST request', () => {
    const reunion = {id: 1, date: '2023-02-01'};
    return testHttpCall(
      service.editarReunion,
      `${apiUrl}/edit/meeting`,
      'POST',
      {updated: true},
      reunion
    )();
  });

  // Prueba para eliminarReunion
  it('eliminarReunion should make POST request', () => {
    const reunion = {id: 1};
    return testHttpCall(
      service.eliminarReunion,
      `${apiUrl}/delete/meeting`,
      'POST',
      {deleted: true},
      reunion
    )();
  });

  // Prueba para getResumenTema
  it('getResumenTema should make GET request', () => {
    const idTema = 404;
    return testHttpCall(
      service.getResumenTema,
      `${apiUrl}/topic/summary/${idTema}`,
      'GET',
      {summary: 'Topic summary'},
      idTema
    )();
  });

  // Prueba para addDuenoTema
  it('addDuenoTema should make POST request', () => {
    const dueno = {topicId: 1, ownerId: 2};
    return testHttpCall(
      service.addDuenoTema,
      `${apiUrl}/add/owner`,
      'POST',
      {added: true},
      dueno
    )();
  });

  // Prueba para getDuenoTema
  it('getDuenoTema should make GET request', () => {
    const idTema = 505;
    return testHttpCall(
      service.getDuenoTema,
      `${apiUrl}/read/owner/${idTema}`,
      'GET',
      {owner: 'Owner Name'},
      idTema
    )();
  });

  // Prueba para borrarDuenoTema
  it('borrarDuenoTema should make POST request', () => {
    const dueno = {topicId: 1, ownerId: 2};
    return testHttpCall(
      service.borrarDuenoTema,
      `${apiUrl}/delete/owner`,
      'POST',
      {deleted: true},
      dueno
    )();
  });

  // Prueba para getEventos
  it('getEventos should make GET request', () => {
    const idTema = 606;
    return testHttpCall(
      service.getEventos,
      `${apiUrl}/read/issue/${idTema}`,
      'GET',
      [{id: 1, event: 'Event 1'}],
      idTema
    )();
  });

  // Prueba para getCoguia
  it('getCoguia should make GET request', () => {
    const idTema = 707;
    return testHttpCall(
      service.getCoguia,
      `${apiUrl}/read/guide/${idTema}`,
      'GET',
      [{id: 1, name: 'Co-guide'}],
      idTema
    )();
  });

  // Prueba para addCoguia
  it('addCoguia should make POST request', () => {
    const coguia = {rut: '12345678-9', id_tema: 1};
    return testHttpCall(
      service.addCoguia,
      `${apiUrl}/add/guide`,
      'POST',
      {added: true},
      coguia
    )();
  });

  // Prueba para borrarCoguia
  it('borrarCoguia should make POST request', () => {
    const coguia = {rut: '12345678-9', id_tema: 1};
    return testHttpCall(
      service.borrarCoguia,
      `${apiUrl}/delete/guide`,
      'POST',
      {deleted: true},
      coguia
    )();
  });
});