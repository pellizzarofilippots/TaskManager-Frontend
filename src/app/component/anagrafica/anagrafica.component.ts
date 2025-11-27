import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 
import { AnagraficaService , Anagrafica } from '../../services/anagrafica.service';
import { UtentiService, Utente } from '../../services/utenti.service';

@Component({
  selector: 'app-anagrafica',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './anagrafica.html',
  styleUrls: ['./anagrafica.css']
})
export class AnagraficaComponent implements OnInit {

  utenti: Anagrafica[] = [];

  newUser: Anagrafica = {

  nome: '',
  cognome: '',
  nascita: null,
  cf: '',


  };

  newUtente: Utente = {
    userId: '',
    password: '',
    dataScadenzaPwd: null,
    codiceAttivazione: '',
    tentativiFalliti: 0,
    forzaCambioPwd: true,
    statoUtenteId: 1,
    ruoloId: 2,
    anagraficaId: null
  };


  constructor(private anagraficaService: AnagraficaService ,
            private utentiService: UtentiService) {}
  ngOnInit(): void {
    this.load();
  }

  load() {
    this.anagraficaService.getAll().subscribe(data => {
      this.utenti = data;
    });
  }

   create(): void {
    console.log("DTO che invio:", this.newUser);

    this.anagraficaService.create(this.newUser).subscribe(created => {
      this.utenti.push(created);

      // Imposto l'id dell'anagrafica appena creata per l'utente
      this.newUtente.anagraficaId = created.id!;

      // Imposto valori di default per i campi obbligatori dell'utente
      this.newUtente.dataScadenzaPwd = new Date(new Date().setMonth(new Date().getMonth() + 6))
    
      this.newUtente.password = "test123";
      this.newUtente.tentativiFalliti = 0;
      this.newUtente.forzaCambioPwd = true;

      // Resetta il form anagrafica
      this.newUser = { id: 0, nome: '', cognome: '', nascita: null, cf: '' };
    });
  }
  delete(id: number): void {
  if (!confirm("Sei sicuro di voler eliminare questa anagrafica?")) {
    return;
  }

  this.anagraficaService.delete(id).subscribe(() => {
    // Ricarico la lista
    this.load();
  });
}

  /** Crea utente con i dati impostati */
  createUtente(): void {
    if (!this.newUtente.anagraficaId) {
      alert('Prima crea un\'anagrafica!');
      return;
    }

    this.utentiService.create(this.newUtente).subscribe(utente => {
      console.log('Utente creato:', utente);

      // Resetta newUtente
      this.newUtente = {
        id: 0,
        userId: '',
        password: '',
        dataScadenzaPwd: null,
        codiceAttivazione: '',
        tentativiFalliti: 0,
        forzaCambioPwd: true,
        statoUtenteId: 1,
        ruoloId: 2,
        anagraficaId: 0
      };
    });




  }
}