import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { ProgettiService, Progetto } from '../../services/progetti.service';

@Component({
  selector: 'app-progetti-list',
  standalone: true,
  imports: [CommonModule, FormsModule,  RouterModule],
  templateUrl: './progetti-list.component.html',
  styleUrls: ['./progetti-list.component.css']
})
export class ProgettiListComponent implements OnInit {

  progetti: Progetto[] = [];

    newProgetto: Progetto = {
    
    nome: '',
    descrizione: '',
    inizio: '',
    fine: '',
    responsabileId: undefined,
    assegnazioni: []   // ← opzionale
  };

  constructor(private progettiService: ProgettiService) {}

  ngOnInit(): void {
    
    this.progettiService.getAll().subscribe(data => {
      console.log('Progetti caricati:', data);
      this.progetti = data;
    });
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
          responsabileId: undefined,
          assegnazioni: [] 
        };
      },
      error: err => {
        console.error("Errore creazione progetto:", err);
      }
    });
  }
  delete(id: number): void {
    this.progettiService.delete(id).subscribe(() => {
      this.progetti = this.progetti.filter(p => p.id !== id);
    });
  }

  isAdmin(): boolean {
  return Number(localStorage.getItem('ruolo')) === 1;
}
}
