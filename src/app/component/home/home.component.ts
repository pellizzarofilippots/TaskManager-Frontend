/*import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {}
*/
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProgettiService, Progetto } from '../../services/progetti.service';
import { AnagraficaService, Anagrafica } from '../../services/anagrafica.service';  // ← Cambia questo

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  progetti: Progetto[] = [];
  anagrafiche: Anagrafica[] = [];  // ← Cambia questo
  utenteLoggato: string = '';
  utenteId: number = 0;
  anagraficaId: number = 0;

  constructor(
    private progettiService: ProgettiService,
    private anagraficaService: AnagraficaService  // ← Cambia questo
  ) {}

  ngOnInit(): void {
    this.utenteLoggato = localStorage.getItem('username') || 'Utente';
     this.anagraficaId = Number(localStorage.getItem('anagraficaId')) || 0; 

    this.loadAnagrafiche();  // ← Cambia questo
    this.loadProgetti();
  }

  loadAnagrafiche(): void {  // ← Cambia questo
    this.anagraficaService.getAll().subscribe(data => {
      this.anagrafiche = data;
      console.log('Anagrafiche caricate:', this.anagrafiche);
    });
  }

   
  loadProgetti(): void {
  this.progettiService.getAll().subscribe(data => {
    console.log('Tutti i progetti:', data);
    console.log('AnagraficaId da cercare:', this.anagraficaId);
    
    // ← AGGIUNGI QUESTO LOG DETTAGLIATO
    data.forEach(progetto => {
      console.log(`\n--- Progetto: ${progetto.nome} (ID: ${progetto.id}) ---`);
      console.log('Assegnazioni:', progetto.assegnazioni);
      console.log('Numero assegnazioni:', progetto.assegnazioni?.length);
      
      if (progetto.assegnazioni && progetto.assegnazioni.length > 0) {
        progetto.assegnazioni.forEach(ass => {
          console.log(`  - personaId: ${ass.personaId}, match: ${ass.personaId === this.anagraficaId}`);
        });
      } else {
        console.log('  ⚠️ NESSUNA ASSEGNAZIONE!');
      }
    });
    
    // Filtra
    this.progetti = data.filter(progetto => {
      const isAssegnato = progetto.assegnazioni?.some(ass => ass.personaId === this.anagraficaId);
      return isAssegnato;
    });
    
    console.log('Progetti filtrati:', this.progetti);
  });
}

  getResponsabileName(responsabileId: number | undefined): string {
    if (!responsabileId) return 'Non assegnato';
    
    const anagrafica = this.anagrafiche.find(a => a.id === responsabileId);  // ← Usa anagrafiche
    return anagrafica ? `${anagrafica.nome} ${anagrafica.cognome}` : `ID: ${responsabileId}`;
  }

  isAdmin(): boolean {
    return Number(localStorage.getItem('ruolo')) === 1;
  }
}