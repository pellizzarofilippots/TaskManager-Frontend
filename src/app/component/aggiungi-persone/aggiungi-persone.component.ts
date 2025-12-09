import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProgettiService, Progetto} from '../../services/progetti.service';
import { AggiungiPersoneService, Assegnazione } from '../../services/aggiungipersone.service';
import { RuoloService, Ruolo } from '../../services/ruoliu.service'; 
import { RuoloProgettoService, RuoloProgetto} from '../../services/ruoliprogetto.service';
import { AnagraficaService, Anagrafica  } from '../../services/anagrafica.service';

@Component({
  selector: 'app-aggiungi-persone',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aggiungi-persone.html'
 // styleUrls: ['./progetti-list.component.css']
})

export class AggiungiPersoneComponent implements OnInit {


     ruoliProgetto: RuoloProgetto[] = [];
     ruoli: Ruolo[] = [];
     assegnazioni: Assegnazione[]=[];
     anagrafiche: Anagrafica[] = [];

    newProgetto: Progetto = {
    nome: '',
    descrizione: '',
    inizio: '',
    fine: '',
    responsabileId: undefined,
    assegnazioni: []  // ← opzionale
  };

  tempAssegnazione: Assegnazione = {
  progettoId:0,  
  personaId: 0,
   ruoloProgettoId: 0,
  hasPrgGestisci: false,
  hasAttAggiungi: false,
  hasAttAssegna: false,
  hasAttStato: false,
  hasAttPrendi: false
};


   constructor(
    private aggiungiPersoneService: AggiungiPersoneService,
    private ruoliService: RuoloService,
    private ruoliProgettoService: RuoloProgettoService,
    private anagraficaService: AnagraficaService,
    private route: ActivatedRoute) {}

   ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('idProgetto'));
  this.tempAssegnazione.progettoId = id;

  console.log("ID PROGETTO RICEVUTO:", id);

  this.loadRuoli();
  this.loadRuoliprogetto();
  this.loadAnagrafiche();
}


  loadRuoli(): void {
  this.ruoliService.getAll().subscribe({
    next: (data: Ruolo[]) => {  // ← tipo esplicito
      this.ruoli = data;
      console.log("Ruoli caricati:", this.ruoli);
    },
    error: (err: any) => console.error("Errore nel caricamento dei ruoli:", err) // ← tipo esplicito
  });
}

loadRuoliprogetto(): void {
  this.ruoliProgettoService.getAll().subscribe({
    next: (data: RuoloProgetto[]) => { 
      this.ruoliProgetto=data;
      console.log("Ruoli progetti caricati", this.ruoliProgetto);
     },
     error: (err: any) => console.error("Errore nel caricamento dei ruoli:", err) 
    });
  }

  loadAnagrafiche(): void {
  this.anagraficaService.getAll().subscribe({
    next: (data: Anagrafica[]) => { 
      this.anagrafiche=data;
      console.log("Ruoli progetti caricati", this.ruoliProgetto);
     },
     error: (err: any) => console.error("Errore nel caricamento dei ruoli:", err) 
    });
  }

addAssegnazione(): void {
  
  this.aggiungiPersoneService.create(this.tempAssegnazione).subscribe(created => {
    console.log("Assegnazione creata:", created);
    this.assegnazioni.push(created);

  this.tempAssegnazione = {
    progettoId: this.tempAssegnazione.progettoId,
    personaId: 0,
     ruoloProgettoId: 0,
    hasPrgGestisci: false,
    hasAttAggiungi: false,
    hasAttAssegna: false,
    hasAttStato: false,
    hasAttPrendi: false
  };
});  
}
}