import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { ProgettiService, Progetto } from '../../services/progetti.service';

@Component({
  selector: 'app-crea-progetti',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crea-progetti.html'
 // styleUrls: ['./progetti-list.component.css']
})

export class CreaProgettiComponent implements OnInit {


    progetti: Progetto[] = [];

    newProgetto: Progetto = {
    
    nome: '',
    descrizione: '',
    inizio: '',
    fine: '',
    responsabileId: undefined   // ← opzionale
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
          responsabileId: undefined
        };
      },
      error: err => {
        console.error("Errore creazione progetto:", err);
      }
    });
  }
}