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
}
