import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TipoAttivita {
  id: number;
  etichetta: string;  // ← AGGIUNGI
  descrizione?: string;
  nome?: string;  // ← Lascia anche questo
}
@Injectable({
  providedIn: 'root'
})
export class TipiAttivitaService {
  private apiUrl = 'http://localhost:8081/api/tipi-attivita';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TipoAttivita[]> {
    const token = localStorage.getItem('token');
    return this.http.get<TipoAttivita[]>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}