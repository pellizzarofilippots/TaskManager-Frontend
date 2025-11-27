import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Anagrafica {
  id?: number; 
  nome: string;
  cognome: string;
  nascita: Date | null;
  cf: string;

}

@Injectable({
  providedIn: 'root'
})
export class AnagraficaService {

  private apiUrl = 'http://localhost:8081/api/anagrafica';

  constructor(private http: HttpClient) { }



  getRuoloUtente(username: string) {
  const token = localStorage.getItem('token');
  return this.http.get<number>(
    `http://localhost:8081/api/utenti/username/${username}`,
    { headers: { Authorization: `Bearer ${token}` } }  // <- qui il token
  );
}


 /* getAll(): Observable<Anagrafica[]> {
    return this.http.get<Anagrafica[]>(this.apiUrl,);
  }*/
 getAll(): Observable<Anagrafica[]> {
  const token = localStorage.getItem('token'); // prendi il token dal localStorage
  return this.http.get<Anagrafica[]>(this.apiUrl, {
    headers: { Authorization: `Bearer ${token}` } // aggiungi l’header
  });
}

  getById(id: number): Observable<Anagrafica> {
    return this.http.get<Anagrafica>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(utente: Anagrafica): Observable<Anagrafica> {
    return this.http.post<Anagrafica>(this.apiUrl, utente, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
