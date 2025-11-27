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
    const token = localStorage.getItem('token'); 
    return this.http.get<Utente[]>(this.apiUrl, {
    headers: { Authorization: `Bearer ${token}` } // aggiungi l’header
  });
  }

   getById(id: number): Observable<Utente> {
    const token = localStorage.getItem('token'); 
    return this.http.get<Utente>(`${this.apiUrl}/id/${id}`, {
    headers: { Authorization: `Bearer ${token}`} // aggiungi l’header
  });
  }


  create(utente: Utente): Observable<Utente> {
    const token = localStorage.getItem('token'); 
    return this.http.post<Utente>(this.apiUrl, utente, {
    headers: { Authorization: `Bearer ${token}`} // aggiungi l’header
  });
  }

  delete(id: number): Observable<void> {
     const token = localStorage.getItem('token'); 
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
    headers: { Authorization: `Bearer ${token}`} // aggiungi l’header
  });
  }

 getRuoloUtente(username: string): Observable<number> {
   const token = localStorage.getItem('token'); 
    return this.http.get<number>(`${this.apiUrl}/username/${username}`,{
    headers: { Authorization: `Bearer ${token}`} // aggiungi l’header
  });
  }
}