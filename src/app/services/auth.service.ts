import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly LOGIN_URL = 'http://localhost:8081/api/login';

  constructor(private http: HttpClient) {}

  /*login(username: string, password: string): Observable<any> {
    const body = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.LOGIN_URL, body, { headers, withCredentials: true })
      .pipe(
        tap(response => {
          // salva username e ruolo in localStorage
          localStorage.setItem('username', username);
          // assumiamo che backend ritorni ruolo come response.ruolo
          if (response.ruolo) {
            localStorage.setItem('ruolo', response.ruolo);
          }
        })
      );
  }*/

      login(username: string, password: string) {
  return this.http.post<any>('http://localhost:8081/api/login', {username, password})
    .pipe(tap(res => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('username', res.username);
      localStorage.setItem('ruolo', res.ruolo.toString());
      localStorage.setItem('anagraficaId', res.anagraficaId.toString());
    }));
}

getAuthHeaders() {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
}

// esempio chiamata utente con JWT
/*getRuoloUtente(username: string) {
  return this.http.get<number>(`http://localhost:8081/api/utenti/username/${username}`, this.getAuthHeaders());
}*/
/*getRuoloUtente(username: string) {
  const token = localStorage.getItem('token');
  return this.http.get<number>(
    `http://localhost:8081/api/utenti/username/${username}`,
    { headers: { Authorization: `Bearer ${token}` } }  // <- qui il token
  );
}*/



  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('ruolo');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getRuolo(): string | null {
    return localStorage.getItem('ruolo');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('username');
    
  }

  
}
