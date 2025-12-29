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
import { AttivitàService, Attività } from '../../services/attivita.service';
import { PrioritaService, Priorita } from '../../services/priorita.service';  // ← AGGIUNGI
import { TipiAttivitaService, TipoAttivita } from '../../services/tipi-attivita.service';
import { StatiAttivitaService, StatoAttivita } from '../../services/stati-attivita.service';  // ← AGGIUNGI

@Component({
  selector: 'app-attivita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestisci-progetto.html',
  styleUrls: ['./gestisci-progetto.css']
})
export class GestisciProgettoCoponent implements OnInit {

  ruoliProgetto: RuoloProgetto[] = [];
  ruoli: Ruolo[] = [];
  assegnazioni: Assegnazione[] = [];
  anagrafiche: Anagrafica[] = [];
  attivita: Attività[] = [];
  
  stati: StatoAttivita[] = [];
  priorita: Priorita[] = [];
  tipiAttivita: TipoAttivita[] = [];

  newProgetto: Progetto = {
    nome: '',
    descrizione: '',
    inizio: '',
    fine: '',
    assegnazioni: []
  };

  tempAssegnazione: Assegnazione = {
    progettoId: 0,  
    personaId: 0,
    ruoloProgettoId: 0,
    hasPrgGestisci: false,
    hasAttAggiungi: false,
    hasAttAssegna: false,
    hasAttStato: false,
    hasAttPrendi: false
  };

  // Oggetto temporaneo per la nuova attività
  tempAttivita: Attività = {
  progettoId: 0,
  statoId: 0,
  prioritaId: 0,  // ← Senza accento
  operatoreId: 0,  // ← Cambia da personaId
  tipoId: 0,  // ← Cambia da tipoAttivitàId
  nome: '',
  descrizione: '',
  inizio: new Date(),
  fine: new Date()
};

  // Flag per mostrare/nascondere form
  showAssegnazioneForm: boolean = false;
  showAttivitaForm: boolean = false;

  constructor(
    private aggiungiPersoneService: AggiungiPersoneService,
    private ruoliService: RuoloService,
    private ruoliProgettoService: RuoloProgettoService,
    private anagraficaService: AnagraficaService,
    private attivitaService: AttivitàService,
    private route: ActivatedRoute,
    private statiAttivitaService: StatiAttivitaService,  // ← AGGIUNGI
    private prioritaService: PrioritaService,  // ← AGGIUNGI
    private tipiAttivitaService: TipiAttivitaService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('idProgetto'));
    this.tempAssegnazione.progettoId = id;
    this.tempAttivita.progettoId = id;

    console.log("ID PROGETTO RICEVUTO:", id);

    this.loadRuoli();
    this.loadRuoliprogetto();
    this.loadAnagrafiche();
    this.loadAssegnazioni();
    this.loadAttivita();
    
    // Carica stati, priorità e tipi attività se hai servizi dedicati
    this.loadStati();
    this.loadPriorita();
    this.loadTipiAttivita();
  }

  loadRuoli(): void {
    this.ruoliService.getAll().subscribe({
      next: (data: Ruolo[]) => {
        this.ruoli = data;
        console.log("Ruoli caricati:", this.ruoli);
      },
      error: (err: any) => console.error("Errore nel caricamento dei ruoli:", err)
    });
  }

  loadRuoliprogetto(): void {
    this.ruoliProgettoService.getAll().subscribe({
      next: (data: RuoloProgetto[]) => { 
        this.ruoliProgetto = data;
        console.log("Ruoli progetti caricati", this.ruoliProgetto);
      },
      error: (err: any) => console.error("Errore nel caricamento dei ruoli progetto:", err) 
    });
  }

  loadAnagrafiche(): void {
    this.anagraficaService.getAll().subscribe({
      next: (data: Anagrafica[]) => { 
        this.anagrafiche = data;
        console.log("Anagrafiche caricate", this.anagrafiche);
      },
      error: (err: any) => console.error("Errore nel caricamento delle anagrafiche:", err) 
    });
  }

  loadAssegnazioni(): void {
  const progettoId = this.tempAssegnazione.progettoId;
  
  if (!progettoId || progettoId === 0) {
    console.warn("ID progetto non valido");
    return;
  }

  this.aggiungiPersoneService.getByProgetto(progettoId).subscribe({
    next: (data: Assegnazione[]) => {
      this.assegnazioni = data;
      console.log("Assegnazioni caricate:", this.assegnazioni);
    },
    error: (err: any) => console.error("Errore nel caricamento delle assegnazioni:", err)
  });
}

 loadAttivita(): void {
  const progettoId = this.tempAttivita.progettoId;
  
  if (!progettoId || progettoId === 0) {
    console.warn("ID progetto non valido per attività");
    return;
  }

  this.attivitaService.getByProgetto(progettoId).subscribe({
    next: (data: Attività[]) => {
      this.attivita = data;
      console.log("Attività caricate:", this.attivita);
    },
    error: (err: any) => console.error("Errore nel caricamento delle attività:", err)
  });
}

 loadStati(): void {
    this.statiAttivitaService.getAll().subscribe({
      next: (data: StatoAttivita[]) => {
        this.stati = data;
        console.log('Stati caricati dal DB:', this.stati);
      },
      error: (err: any) => console.error('Errore caricamento stati:', err)
    });
  }

    loadPriorita(): void {
    this.prioritaService.getAll().subscribe({
      next: (data: Priorita[]) => {
        this.priorita = data;
        console.log('Priorità caricate dal DB:', this.priorita);
      },
      error: (err: any) => console.error('Errore caricamento priorità:', err)
    });
  }

  loadTipiAttivita(): void {
    this.tipiAttivitaService.getAll().subscribe({
      next: (data: TipoAttivita[]) => {
        this.tipiAttivita = data;
        console.log('Tipi attività caricati dal DB:', this.tipiAttivita);
      },
      error: (err: any) => console.error('Errore caricamento tipi:', err)
    });
  }

  addAssegnazione(): void {
    console.log('tempAssegnazione:', this.tempAssegnazione);
    this.aggiungiPersoneService.create(this.tempAssegnazione).subscribe({
      next: (created) => {
        console.log("Assegnazione creata:", created);
        this.assegnazioni.push(created);
        this.resetTempAssegnazione();
        this.showAssegnazioneForm = false;
      },
      error: (err) => console.error("Errore nella creazione dell'assegnazione:", err)
    });  
  }

addAttivita(): void {
  // Validazione
  if (!this.tempAttivita.nome || !this.tempAttivita.statoId || 
      !this.tempAttivita.prioritaId || !this.tempAttivita.tipoId) {
    alert("Compilare tutti i campi obbligatori (nome, stato, priorità, tipo)");
    return;
  }

  this.attivitaService.create(this.tempAttivita).subscribe({
    next: (created) => {
      console.log("Attività creata:", created);
      this.attivita.push(created);
      this.resetTempAttivita();
      this.showAttivitaForm = false;
      alert("Attività creata con successo!");
    },
    error: (err) => {
      console.error("Errore nella creazione dell'attività:", err);
      alert("Errore nella creazione dell'attività");
    }
  });
}
  resetTempAssegnazione(): void {
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
  }

resetTempAttivita(): void {
  this.tempAttivita = {
    progettoId: this.tempAttivita.progettoId,
    statoId: 0,
    prioritaId: 0,  // ← Senza accento
    operatoreId: 0,  // ← Cambia da personaId
    tipoId: 0,  // ← Cambia da tipoAttivitàId
    nome: '',
    descrizione: '',
    inizio: new Date(),
    fine: new Date()
  };
}

  toggleAssegnazioneForm(): void {
    this.showAssegnazioneForm = !this.showAssegnazioneForm;
    if (this.showAssegnazioneForm) {
      this.showAttivitaForm = false;
    }
  }

  toggleAttivitaForm(): void {
    this.showAttivitaForm = !this.showAttivitaForm;
    if (this.showAttivitaForm) {
      this.showAssegnazioneForm = false;
    }
  }

  getPersonaNome(personaId: number): string {
    const persona = this.anagrafiche.find(a => a.id === personaId);
    return persona ? `${persona.nome} ${persona.cognome}` : 'N/A';
  }

getRuoloProgettoNome(ruoloId: number): string {
    const ruolo = this.ruoliProgetto.find(r => r.id === ruoloId);
    return ruolo ? (ruolo.etichetta || ruolo.descrizione) : 'N/A';
  }

 getStatoNome(statoId: number): string {
  const stato = this.stati.find(s => s.id === statoId);
  return stato ? stato.etichetta : 'N/A';  // ← Cambia da stato.nome a stato.etichetta
}

getPrioritaNome(prioritaId: number): string {
  const priorita = this.priorita.find(p => p.id === prioritaId);
  return priorita ? priorita.etichetta : 'N/A';  // ← Cambia da priorita.nome a priorita.etichetta
}

    isAdmin(): boolean {
    return Number(localStorage.getItem('ruolo')) === 1;
  }
}