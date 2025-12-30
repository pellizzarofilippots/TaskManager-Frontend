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
import { StatiAttivitaService, StatoAttivita } from '../../services/stati-attivita.service';
import { EsecuzioneService, Esecuzione } from '../../services/esecuzione.service';  

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


    // ← AGGIUNGI QUESTE QUI
  esecuzioniMap: Map<number, Esecuzione[]> = new Map();
  esecuzioniExpandedMap: Map<number, boolean> = new Map();
  attivitaRegistraLavoro: Attività | null = null;
  
  tempEsecuzione: Esecuzione = {
    attivitaId: 0,
    operatoreId: 0,
    data: new Date().toISOString().split('T')[0],
    durata: 0,
    note: ''
  };
  // Aggiungi queste proprietà
isEditMode: boolean = false;
attivitaInModifica: Attività | null = null;

  constructor(
    private aggiungiPersoneService: AggiungiPersoneService,
    private ruoliService: RuoloService,
    private ruoliProgettoService: RuoloProgettoService,
    private anagraficaService: AnagraficaService,
    private attivitaService: AttivitàService,
    private route: ActivatedRoute,
    private statiAttivitaService: StatiAttivitaService,  // ← AGGIUNGI
    private prioritaService: PrioritaService,  // ← AGGIUNGI
    private tipiAttivitaService: TipiAttivitaService,
    private esecuzioneService: EsecuzioneService  
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
          
      this.loadEsecuzioniPerAttivita(); 
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
    console.log('tempAttivita PRIMA della validazione:', this.tempAttivita);
  if (!this.tempAttivita.nome || !this.tempAttivita.statoId || 
      !this.tempAttivita.prioritaId || !this.tempAttivita.tipoId) {
    alert("Compilare tutti i campi obbligatori (nome, stato, priorità, tipo)");
    return;
  }


  if (this.isEditMode && this.attivitaInModifica) {
    // MODIFICA attività esistente
    const payload = { 
      ...this.tempAttivita, 
      id: this.attivitaInModifica.id 
    };
    
    this.attivitaService.update(this.attivitaInModifica.id!, payload).subscribe({
      next: (updated) => {
        console.log("Attività aggiornata:", updated);
        // Aggiorna la lista
        const index = this.attivita.findIndex(a => a.id === updated.id);
        if (index !== -1) {
          this.attivita[index] = updated;
        }
        this.resetForm();
        alert("Attività aggiornata con successo!");
      },
      error: (err) => {
        console.error("Errore nell'aggiornamento:", err);
        alert("Errore nell'aggiornamento dell'attività");
      }
    });
  } else {
    // CREA nuova attività
    this.attivitaService.create(this.tempAttivita).subscribe({
      next: (created) => {
        console.log("Attività creata:", created);
        this.attivita.push(created);
        this.resetForm();
        alert("Attività creata con successo!");
      },
      error: (err) => {
        console.error("Errore nella creazione:", err);
        alert("Errore nella creazione dell'attività");
      }
    });
  }
}
resetForm(): void {
  this.resetTempAttivita();
  this.showAttivitaForm = false;
  this.isEditMode = false;
  this.attivitaInModifica = null;
}
modificaAttivita(attivita: Attività): void {
  this.isEditMode = true;
  this.attivitaInModifica = attivita;
  
  // Popola il form con i dati dell'attività
  this.tempAttivita = {
    progettoId: attivita.progettoId,
    statoId: attivita.statoId,
    prioritaId: attivita.prioritaId,
    operatoreId: attivita.operatoreId,
    tipoId: attivita.tipoId,
    nome: attivita.nome,
    descrizione: attivita.descrizione || '',
    inizio: attivita.inizio,
    fine: attivita.fine || ''
  };
  console.log("tempAttivita dopo popolamento:", this.tempAttivita);
  
  this.showAttivitaForm = true;
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
eliminaAttivita(id: number | undefined): void {
  if (!id) {
    return;
  }
  
  if (!confirm('Vuoi eliminare questa attività?')) {
    return;
  }

  this.attivitaService.delete(id).subscribe({
    next: () => {
      console.log('Attività eliminata');
      // Rimuovi dall'array locale
      this.attivita = this.attivita.filter(a => a.id !== id);
      alert('Attività eliminata con successo');
    },
    error: (err) => {
      console.error('Errore nell\'eliminazione:', err);
      alert('Errore nell\'eliminazione dell\'attività');
    }
  });
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

nuovaAttivita(): void {
  this.isEditMode = false;           // ← Disattiva modalità modifica
  this.attivitaInModifica = null;    // ← Pulisci attività in modifica
  this.resetTempAttivita();          // ← Resetta il form
  this.showAttivitaForm = true;      // ← Mostra il form
}

getPersonaInitials(personaId: number): string {
  const persona = this.anagrafiche.find(a => a.id === personaId);
  if (persona) {
    const inizialeNome = persona.nome.charAt(0).toUpperCase();
    const inizialeCognome = persona.cognome.charAt(0).toUpperCase();
    return `${inizialeNome}${inizialeCognome}`;
  }
  return '??';
}

    isAdmin(): boolean {
    return Number(localStorage.getItem('ruolo')) === 1;
  }

  loadEsecuzioniPerAttivita(): void {
  this.attivita.forEach(att => {
    if (att.id) {
      this.esecuzioneService.getByAttivita(att.id).subscribe({
        next: (esecuzioni) => {
          this.esecuzioniMap.set(att.id!, esecuzioni);
        },
        error: (err) => console.error(`Errore caricamento esecuzioni per attività ${att.id}:`, err)
      });
    }
  });
}

getEsecuzioni(attivitaId: number): Esecuzione[] {
  return this.esecuzioniMap.get(attivitaId) || [];
}

// Conta le esecuzioni di un'attività
getEsecuzioniCount(attivitaId: number): number {
  return this.getEsecuzioni(attivitaId).length;
}

// Verifica se le esecuzioni sono espanse
isEsecuzioniExpanded(attivitaId: number): boolean {
  return this.esecuzioniExpandedMap.get(attivitaId) || false;
}

// Toggle espansione esecuzioni
toggleEsecuzioni(attivitaId: number): void {
  const current = this.isEsecuzioniExpanded(attivitaId);
  this.esecuzioniExpandedMap.set(attivitaId, !current);
}

// Calcola il totale delle ore lavorate
calcolaTotaleOre(attivitaId: number): number {
  const esecuzioni = this.getEsecuzioni(attivitaId);
  return esecuzioni.reduce((totale, exec) => totale + (exec.durata || 0), 0);
}

// Apre il form per registrare lavoro
toggleRegistraLavoro(attivita: Attività): void {
  if (this.attivitaRegistraLavoro?.id === attivita.id) {
    // Se è già aperto, chiudi
    this.annullaRegistraLavoro();
  } else {
    // Apri per questa attività
    this.attivitaRegistraLavoro = attivita;
    this.tempEsecuzione = {
      attivitaId: attivita.id!,
      operatoreId: Number(localStorage.getItem('userId')) || 0,  // Operatore corrente
      data: new Date().toISOString().split('T')[0],
      durata: 0,
      note: ''
    };
  }
}

// Annulla registrazione lavoro
annullaRegistraLavoro(): void {
  this.attivitaRegistraLavoro = null;
  this.tempEsecuzione = {
    attivitaId: 0,
    operatoreId: 0,
    data: new Date().toISOString().split('T')[0],
    durata: 0,
    note: ''
  };
}

// Salva l'esecuzione
salvaEsecuzione(attivitaId: number): void {
  // Validazione
  if (!this.tempEsecuzione.data || this.tempEsecuzione.durata <= 0 || 
      this.tempEsecuzione.operatoreId === 0) {
    alert('Compilare data, ore e operatore');
    return;
  }

  this.esecuzioneService.create(this.tempEsecuzione).subscribe({
    next: (created) => {
      console.log('Esecuzione registrata:', created);
      
      // Aggiorna la mappa delle esecuzioni
      const esecuzioni = this.esecuzioniMap.get(attivitaId) || [];
      esecuzioni.unshift(created);  // Aggiungi in testa (più recente)
      this.esecuzioniMap.set(attivitaId, esecuzioni);
      
      // Espandi automaticamente le esecuzioni
      this.esecuzioniExpandedMap.set(attivitaId, true);
      
      // Chiudi il form
      this.annullaRegistraLavoro();
      
      alert('Lavoro registrato con successo!');
    },
    error: (err) => {
      console.error('Errore nella registrazione:', err);
      alert('Errore nella registrazione del lavoro');
    }
  });
}

// Elimina un'esecuzione
eliminaEsecuzione(esecuzioneId: number, attivitaId: number): void {
  if (!confirm('Vuoi eliminare questa registrazione?')) {
    return;
  }

  this.esecuzioneService.delete(esecuzioneId).subscribe({
    next: () => {
      console.log('Esecuzione eliminata');
      
      // Rimuovi dalla mappa
      const esecuzioni = this.esecuzioniMap.get(attivitaId) || [];
      const filtered = esecuzioni.filter(e => e.id !== esecuzioneId);
      this.esecuzioniMap.set(attivitaId, filtered);
      
      alert('Registrazione eliminata');
    },
    error: (err) => {
      console.error('Errore nell\'eliminazione:', err);
      alert('Errore nell\'eliminazione');
    }
  });
}

}