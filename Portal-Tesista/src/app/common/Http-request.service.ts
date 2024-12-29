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
}
