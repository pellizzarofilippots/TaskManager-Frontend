import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ruolo {
  id: number;
  nomeRuolo: string;   // usa lo stesso nome del backend
  descrizione: string;
}


@Injectable({
  providedIn: 'root'
})
export class RuoloService {
  private apiUrl = 'http://localhost:8081/api/ruoliu';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ruolo[]> {
    const token = localStorage.getItem('token'); 
    return this.http.get<Ruolo[]>(this.apiUrl,  {
    headers: { Authorization: `Bearer ${token}` }});
    
  }
}