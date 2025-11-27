import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtentiService, Utente } from '../../services/utenti.service';
import { ActivatedRoute } from '@angular/router';
import { RuoloService, Ruolo } from '../../services/ruoliu.service';

@Component({
  selector: 'app-utenti',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './utenti.html',
  styleUrls: ['./utenti.css']
})
export class UtentiComponent implements OnInit {

  utenti: Utente[] = [];

  ruoli: Ruolo[] = [];

  newUtente: Utente = {
    userId: '',
    password: '',
    dataScadenzaPwd: null,
    codiceAttivazione: '',

    forzaCambioPwd: true,
    anagraficaId: null
  };

  constructor(private utentiService: UtentiService,private ruoloService: RuoloService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {

     const idAnagrafica = this.route.snapshot.paramMap.get('idAnagrafica');
    if (idAnagrafica) {
      this.newUtente.anagraficaId = +idAnagrafica;
    }

    this.load();

    this.ruoloService.getAll().subscribe(data => {
       console.log('Ruoli dal backend:', data);
    this.ruoli = data;
    })
  }

  load() {
    this.utentiService.getAll().subscribe(data => {
      this.utenti = data;
    });
  }

   createUtente(): void {
    if (!this.newUtente.anagraficaId) {
      alert('ID anagrafica non impostato!');
      return;
    }

    // Imposta data scadenza password
    this.newUtente.dataScadenzaPwd = new Date(new Date().setMonth(new Date().getMonth() + 6));

    console.log('Creo utente:', this.newUtente); 
    this.utentiService.create(this.newUtente).subscribe(created => {
      this.utenti.push(created);

    
      this.newUtente.userId = '';
      this.newUtente.password = '';
      this.newUtente.tentativiFalliti = 0;
      this.newUtente.forzaCambioPwd = true;
      this.newUtente.codiceAttivazione = '';
    });
  }
  delete(id: number): void {
    this.utentiService.delete(id).subscribe(() => {
      this.utenti = this.utenti.filter(u => u.id !== id);
    });
  }
}
