import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StatoAttivita {
  id: number;
  etichetta: string;  // ← AGGIUNGI
  icona?: string;
  ordine?: number;
  isInattiva?: boolean;
  nome?: string;  // ← Lascia anche questo per retrocompatibilità
}

@Injectable({
  providedIn: 'root'
})
export class StatiAttivitaService {
  private apiUrl = 'http://localhost:8081/api/stati-attivita';

  constructor(private http: HttpClient) {}

  getAll(): Observable<StatoAttivita[]> {
    const token = localStorage.getItem('token');
    return this.http.get<StatoAttivita[]>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}