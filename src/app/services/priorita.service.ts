import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Priorita {
  id: number;
  etichetta: string;  // ← AGGIUNGI
  icona?: string;
  ordine?: number;
  nome?: string;  // ← Lascia anche questo

}
@Injectable({
  providedIn: 'root'
})
export class PrioritaService {
  private apiUrl = 'http://localhost:8081/api/priorita';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Priorita[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Priorita[]>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}