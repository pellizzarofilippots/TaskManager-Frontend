import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface RuoloProgetto {
  id: number;
  icona: string;   // usa lo stesso nome del backend
  etichetta?: string;
  descrizione: string;
  indCanc?: number;
}


@Injectable({
  providedIn: 'root'
})
export class RuoloProgettoService {
  private apiUrl = 'http://localhost:8081/api/ruoliProgetto';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RuoloProgetto[]> {
    const token = localStorage.getItem('token'); 
    return this.http.get<RuoloProgetto[]>(this.apiUrl,  {
    headers: { Authorization: `Bearer ${token}` }});
    
  }
}