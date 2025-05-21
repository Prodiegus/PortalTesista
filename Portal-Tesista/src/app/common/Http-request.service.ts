import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  private apiUrl = environment["api-portal-tesista"].url;

  constructor(private http: HttpClient) { }

  async getUsuarios(): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/allUser`;
    return this.http.get<any>(endpoint);
  }

  async editarUsuario(usuario: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/update/user`;
    return this.http.post<any>(endpoint, usuario);
  }

  async getEscuelas() {
    const endpoint = `${this.apiUrl}/read/schools`;
    return this.http.get<any>(endpoint);
  }

  async crearEscuela(escuela: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/create/school`;
    return this.http.post<any>(endpoint, escuela);
  }

  async editarEscuela(escuela: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/edit/school`;
    return this.http.post<any>(endpoint, escuela);
  }

  async getUserData(token: string | undefined): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/user`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(endpoint, { headers });
  }

  async getProfesores(escuela: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/allUser/`+escuela;
    return this.http.get<any>(endpoint);
  }

  async addDocente(addDocente: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/create/user`;
    return this.http.post<any>(endpoint, addDocente);
  }

  async desactivarDocente(docente: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/disable/user`;
    return this.http.post<any>(endpoint, docente);
  }

  async activarDocente(docente: any): Promise<Observable<any>> {
      const endpoint = `${this.apiUrl}/enable/user`;
      return this.http.post<any>(endpoint, docente);
  }

  async getFlujosGenerales(escuela: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/work-flow/escuela/${escuela}`;
    return this.http.get<any>(endpoint);
  }

  async getFasesTema(id_tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/topic-phase/${id_tema}`;
    return this.http.get<any>(endpoint);
  }

  async addFasesTema(fase: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/create/subphase`;
    return this.http.post<any>(endpoint, fase);
  }

  async getFasesFlujo(id: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/work-flow/phase/${id}`;
    return this.http.get<any>(endpoint);
  }

  async addFaseFlujo(faseFlujo: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/create/phase`;
    return this.http.post<any>(endpoint, faseFlujo);
  }

  async editFaseFlujo(faseFlujo: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/edit/phase`;
    return this.http.post<any>(endpoint, faseFlujo);
  }

  async deleteFaseFlujo(faseFlujo: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/delete/phase`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(faseFlujo)
    };
    return this.http.delete<any>(endpoint, options);
  }

  async getTemas(): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/topic`;
    return this.http.get<any>(endpoint);
  }

  async getTemasUsuario(rut: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/topic/${rut}`;
    return this.http.get<any>(endpoint);
  }

  async getTemasRevisionUsuario(rut: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/review/topic/${rut}`;
    return this.http.get<any>(endpoint);
  }

  async addTema(tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/create/topic`;
    return this.http.post<any>(endpoint, tema);
  }

  async editTema(tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/edit/topic`;
    return this.http.post<any>(endpoint, tema);
  }

  async cambiarEstadoTema(tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/change/topic-status`;
    return this.http.post<any>(endpoint, tema);
  }

  async solicitarTema(tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/request/topic`;
    return this.http.post<any>(endpoint, tema);
  }

  async aceptarTema(tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/accept/topic`;
    return this.http.post<any>(endpoint, tema);
  }

  async getSolicitudes(id_tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/topic-request/${id_tema}`;
    return this.http.get<any>(endpoint);
  }

  async subirAvance(avance: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/upload/preview`;
    return this.http.post<any>(endpoint, avance);
  }

  async getAvancesTema(id_tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/preview/${id_tema}`;
    return this.http.get<any>(endpoint);
  }

  async getUltimoAvanceTema(id_tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/latest/preview/${id_tema}`;
    return this.http.get<any>(endpoint);
  }

  async getRevisoresTema(id_tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/reviewer/${id_tema}`;
    return this.http.get<any>(endpoint);
  }

  async addRevisor(revisor: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/add/reviewer`;
    return this.http.post<any>(endpoint, revisor);
  }

  async borrarRevisor(revisor: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/delete/reviewer`;
    return this.http.post<any>(endpoint, revisor);
  }

  async empezarRevisionAvance(avance: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/start/review`;
    return this.http.post<any>(endpoint, avance);
  }

  async calificarAvance(calificacion: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/grade/review`;
    return this.http.post<any>(endpoint, calificacion);
  }

  async faseSiguiente(id_tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/move/phase/forward/${id_tema}`;
    const requestBody = {
      "id_tema": id_tema
    }
    return this.http.post<any>(endpoint, requestBody);
  }

  async faseAnterior(id_tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/move/phase/backward/${id_tema}`;
    const requestBody = {
      "id_tema": id_tema
    }
    return this.http.post<any>(endpoint, requestBody);
  }

  async crearReuniones(reunion: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/create/meeting`;
    return this.http.post<any>(endpoint, reunion);
  }

  async getReuniones(id_tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/meeting/${id_tema}`;
    return this.http.get<any>(endpoint);
  }

  async editarReunion(reunion: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/edit/meeting`;
    return this.http.post<any>(endpoint, reunion);
  }

  async eliminarReunion(reunion: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/delete/meeting`;
    return this.http.post<any>(endpoint, reunion);
  }

  async getResumenTema(id_tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/topic/summary/${id_tema}`;
    return this.http.get<any>(endpoint);
  }

  async addDuenoTema(dueno: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/add/owner`;
    return this.http.post<any>(endpoint, dueno);
  }

  async getDuenoTema(id_tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/owner/${id_tema}`;
    return this.http.get<any>(endpoint);
  }

  async borrarDuenoTema(dueno: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/delete/owner`;
    return this.http.post<any>(endpoint, dueno);
  }

  async getEventos(id_tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/issue/${id_tema}`;
    return this.http.get<any>(endpoint);
  }

  async getCoguia(id_tema: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/read/guide/${id_tema}`;
    return this.http.get<any>(endpoint);
  }

  async addCoguia(coguia: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/add/guide`;
    return this.http.post<any>(endpoint, coguia);
  }

  async borrarCoguia(coguia: any): Promise<Observable<any>> {
    const endpoint = `${this.apiUrl}/delete/guide`;
    return this.http.post<any>(endpoint, coguia);
  }

}
