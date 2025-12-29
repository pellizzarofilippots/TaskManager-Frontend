import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Attività {
  id?: number;
  progettoId?: number;  
  statoId: number;
  prioritaId: number;  // ← Senza accento (backend usa "priorita")
  operatoreId?: number;  // ← Cambia da personaId (backend usa "operatore")
  tipoId: number;  // ← Cambia da tipoAttivitàId (backend usa "tipo")
  nome: string;
  descrizione: string;
  inizio: Date | string;  // ← Può essere Date o string
  fine: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class AttivitàService {

  private apiUrl = 'http://localhost:8081/api/attivita';

  constructor(private http: HttpClient) {}

  // Crea una nuova attività
  create(attività: Attività): Observable<Attività> {
    const token = localStorage.getItem('token');
    return this.http.post<Attività>(this.apiUrl, attività, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Ottieni tutte le attività
  getAll(): Observable<Attività[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Attività[]>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Ottieni un'attività per ID
  getById(id: number): Observable<Attività> {
    const token = localStorage.getItem('token');
    return this.http.get<Attività>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Ottieni attività per progetto
  getByProgetto(progettoId: number): Observable<Attività[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Attività[]>(`${this.apiUrl}/progetto/${progettoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Ottieni attività per persona
  getByPersona(personaId: number): Observable<Attività[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Attività[]>(`${this.apiUrl}/persona/${personaId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Aggiorna un'attività
  update(id: number, attività: Attività): Observable<Attività> {
    const token = localStorage.getItem('token');
    return this.http.put<Attività>(`${this.apiUrl}/${id}`, attività, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Aggiorna lo stato di un'attività
  updateStato(id: number, statoId: number): Observable<Attività> {
    const token = localStorage.getItem('token');
    return this.http.patch<Attività>(`${this.apiUrl}/${id}/stato`, { statoId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Elimina un'attività
  delete(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}