import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ===== INTERFACE =====
export interface Esecuzione {
  id?: number;
  attivitaId: number;
  operatoreId: number;
  data: string | Date;
  durata: number;  // ore lavorate (es: 2.5 per 2 ore e 30 minuti)
  note?: string;
  indCanc?: boolean;
}

// ===== SERVICE =====
@Injectable({
  providedIn: 'root'
})
export class EsecuzioneService {
  private apiUrl = 'http://localhost:8081/api/esecuzioni';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Esecuzione[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Esecuzione[]>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getById(id: number): Observable<Esecuzione> {
    const token = localStorage.getItem('token');
    return this.http.get<Esecuzione>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getByAttivita(attivitaId: number): Observable<Esecuzione[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Esecuzione[]>(`${this.apiUrl}/attivita/${attivitaId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getByOperatore(operatoreId: number): Observable<Esecuzione[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Esecuzione[]>(`${this.apiUrl}/operatore/${operatoreId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  create(esecuzione: Esecuzione): Observable<Esecuzione> {
    const token = localStorage.getItem('token');
    return this.http.post<Esecuzione>(this.apiUrl, esecuzione, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  update(id: number, esecuzione: Esecuzione): Observable<Esecuzione> {
    const token = localStorage.getItem('token');
    return this.http.put<Esecuzione>(`${this.apiUrl}/${id}`, esecuzione, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  delete(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}