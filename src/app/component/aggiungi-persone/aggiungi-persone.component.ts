import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProgettiService, Progetto} from '../../services/progetti.service';
import { AggiungiPersoneService, Assegnazione } from '../../services/aggiungipersone.service';

@Component({
  selector: 'app-aggiungi-persone',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aggiungi-persone.html'
 // styleUrls: ['./progetti-list.component.css']
})

export class AggiungiPersoneComponent implements OnInit {


    
    assegnazioni: Assegnazione[]=[];

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
  ruoloId: 0,
  hasPrgGestisci: false,
  hasAttAggiungi: false,
  hasAttAssegna: false,
  hasAttStato: false,
  hasAttPrendi: false
};


   constructor(private aggiungiPersoneService: AggiungiPersoneService,
    private route: ActivatedRoute) {}

   ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('idProgetto'));
  this.tempAssegnazione.progettoId = id;

  console.log("ID PROGETTO RICEVUTO:", id);
}

addAssegnazione(): void {
  
  this.aggiungiPersoneService.create(this.tempAssegnazione).subscribe(created => {
    console.log("Assegnazione creata:", created);
    this.assegnazioni.push(created);

  this.tempAssegnazione = {
    progettoId: this.tempAssegnazione.progettoId,
    personaId: 0,
    ruoloId: 0,
    hasPrgGestisci: false,
    hasAttAggiungi: false,
    hasAttAssegna: false,
    hasAttStato: false,
    hasAttPrendi: false
  };
});


 
  
}
}