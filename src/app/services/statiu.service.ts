import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Statou {
  id: number;
  etichetta: string;   // usa lo stesso nome del backend
  descrizione: string;
}


@Injectable({
  providedIn: 'root'
})
export class StatiuService {
  private apiUrl = 'http://localhost:8081/api/statiu';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Statou[]> {
    const token = localStorage.getItem('token'); 
    return this.http.get<Statou[]>(this.apiUrl,  {
    headers: { Authorization: `Bearer ${token}` }});
    
  }
}