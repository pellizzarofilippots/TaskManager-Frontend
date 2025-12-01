import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Assegnazione {
  personaId: number;
  ruoloId: number;
  hasPrgGestisci: boolean;
  hasAttAggiungi: boolean;
  hasAttAssegna: boolean;
  hasAttStato: boolean;
  hasAttPrendi: boolean;
}

export interface Progetto {
  id?: number;
  responsabileId?: number,
  nome: string;
  descrizione?: string;
  inizio: string;
  fine?: string;

  assegnazioni: Assegnazione[];
}

@Injectable({
  providedIn: 'root'
})
export class ProgettiService {

  private apiUrl = 'http://localhost:8081/api/progetti';

  constructor(private http: HttpClient) { }
getAll(): Observable<Progetto[]> {
   const token = localStorage.getItem('token');
  return this.http.get<Progetto[]>(this.apiUrl, {
    headers: { Authorization: `Bearer ${token}` }});
}

getById(id: number): Observable<Progetto> {
  return this.http.get<Progetto>(`${this.apiUrl}/${id}`, { withCredentials: true });
}

create(progetto: Progetto): Observable<Progetto> {
   const token = localStorage.getItem('token');
  return this.http.post<Progetto>(this.apiUrl, progetto,  {
    headers: { Authorization: `Bearer ${token}` }});
}

delete(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
}
}