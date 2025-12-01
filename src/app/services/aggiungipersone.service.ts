import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Assegnazione {
  progettoId?: number;  
  personaId: number;
  ruoloId: number;
  hasPrgGestisci: boolean;
  hasAttAggiungi: boolean;
  hasAttAssegna: boolean;
  hasAttStato: boolean;
  hasAttPrendi: boolean;

  

}
@Injectable({
  providedIn: 'root'
})
export class AggiungiPersoneService{

    private apiUrl='http://localhost:8081/api/aggiungipersone';

    constructor(private http: HttpClient){}

     create(assegnazione: Assegnazione):Observable<any>{
        const token = localStorage.getItem('token');
         return this.http.post<Assegnazione>(this.apiUrl, assegnazione,  {
            headers: { Authorization: `Bearer ${token}` }});
        }

     


    }

