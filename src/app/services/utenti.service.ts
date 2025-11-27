import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
/*
export interface Utente {
  id: number;
  userId: string;
  password: string;
  dataScadenzaPwd?: string;
  codiceAttivazione?: string;
  tentativiFalliti?: number;
  forzaCambioPwd?: boolean;
  statoId: number;
  ruoloId: number;
  anagraficaId: number;
}*/
export interface Utente {
  id?: number;  
  userId: string;
  password?: string;
  dataScadenzaPwd?: Date | null;  // obbligatorio
  codiceAttivazione?: string;
  tentativiFalliti?: number;
  forzaCambioPwd?: boolean;
  statoUtenteId?: number;           // obbligatorio
  ruoloId?: number;           // obbligatorio
  anagraficaId?: number | null;
     // obbligatorio
}

@Injectable({
  providedIn: 'root'
})
export class UtentiService {

  private apiUrl = 'http://localhost:8081/api/utenti';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Utente[]> {
    return this.http.get<Utente[]>(this.apiUrl);
  }

   getById(id: number): Observable<Utente> {
    return this.http.get<Utente>(`${this.apiUrl}/id/${id}`, { withCredentials: true });
  }


  create(utente: Utente): Observable<Utente> {
    return this.http.post<Utente>(this.apiUrl, utente, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

 getRuoloUtente(username: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/username/${username}`, { withCredentials: true });
  }
}