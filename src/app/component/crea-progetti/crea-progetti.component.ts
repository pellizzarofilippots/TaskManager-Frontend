import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { ProgettiService, Progetto, Assegnazione} from '../../services/progetti.service';

@Component({
  selector: 'app-crea-progetti',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crea-progetti.html',
  styleUrls: ['./crea-progetti.css']
 // styleUrls: ['./progetti-list.component.css']
})

export class CreaProgettiComponent implements OnInit {


    progetti: Progetto[] = [];

    newProgetto: Progetto = {
    
    nome: '',
    descrizione: '',
    inizio: '',
    fine: '',
    assegnazioni: []  // ← opzionale
  };

  tempAssegnazione: Assegnazione = {
  personaId: 0,
  ruoloId: 0,
  hasPrgGestisci: false,
  hasAttAggiungi: false,
  hasAttAssegna: false,
  hasAttStato: false,
  hasAttPrendi: false
};


   constructor(private progettiService: ProgettiService) {}

  ngOnInit(): void {
    // anche vuoto va bene
  }

  
  createProgetto(): void {

    if (!this.newProgetto.nome || !this.newProgetto.inizio) {
      alert("Nome e data inizio sono obbligatori!");
      return;
    }

    console.log("Creo progetto:", this.newProgetto);

    this.progettiService.create(this.newProgetto).subscribe({
      next: created => {
        this.progetti.push(created);

        // reset form
        this.newProgetto = {
          nome: '',
          descrizione: '',
          inizio: '',
          fine: '',
          assegnazioni: [] 

        };
      },
      error: err => {
        console.error("Errore creazione progetto:", err);
      }
    });
  }
   addAssegnazione(): void {
  this.newProgetto.assegnazioni.push({...this.tempAssegnazione}); // clona l’oggetto
  // resetta il form
  this.tempAssegnazione = {
    personaId: 0,
    ruoloId: 0,
    hasPrgGestisci: false,
    hasAttAggiungi: false,
    hasAttAssegna: false,
    hasAttStato: false,
    hasAttPrendi: false
  };
}
}