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

@Component({
  selector: 'app-attivita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestisci-progetto.html'
})
export class GestisciProgettoCoponent implements OnInit {

  ruoliProgetto: RuoloProgetto[] = [];
  ruoli: Ruolo[] = [];
  assegnazioni: Assegnazione[] = [];
  anagrafiche: Anagrafica[] = [];
  attivita: Attività[] = [];
  
  // Stati e priorità (da popolare con servizi dedicati se esistono)
  stati: any[] = [];
  priorita: any[] = [];
  tipiAttivita: any[] = [];

  newProgetto: Progetto = {
    nome: '',
    descrizione: '',
    inizio: '',
    fine: '',
    responsabileId: undefined,
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
    prioritàId: 0,
    personaId: 0,
    tipoAttivitàId: 0,
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
    private route: ActivatedRoute
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
    // Carica le attività del progetto
    // Devi implementare un metodo getByProgetto nel servizio AttivitàService
    console.log("Caricamento attività per progetto:", this.tempAttivita.progettoId);
    // this.attivitaService.getByProgetto(this.tempAttivita.progettoId).subscribe(...)
  }

  loadStati(): void {
    // Mock data - sostituisci con chiamata al servizio
    this.stati = [
      { id: 1, nome: 'Da iniziare' },
      { id: 2, nome: 'In corso' },
      { id: 3, nome: 'Completata' },
      { id: 4, nome: 'Bloccata' }
    ];
  }

  loadPriorita(): void {
    // Mock data - sostituisci con chiamata al servizio
    this.priorita = [
      { id: 1, nome: 'Bassa' },
      { id: 2, nome: 'Media' },
      { id: 3, nome: 'Alta' },
      { id: 4, nome: 'Critica' }
    ];
  }

  loadTipiAttivita(): void {
    // Mock data - sostituisci con chiamata al servizio
    this.tipiAttivita = [
      { id: 1, nome: 'Sviluppo' },
      { id: 2, nome: 'Testing' },
      { id: 3, nome: 'Documentazione' },
      { id: 4, nome: 'Revisione' }
    ];
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
    // Validazione base
    if (!this.tempAttivita.nome || !this.tempAttivita.personaId) {
      alert("Compilare tutti i campi obbligatori");
      return;
    }

    this.attivitaService.create(this.tempAttivita).subscribe({
      next: (created) => {
        console.log("Attività creata:", created);
        this.attivita.push(created);
        this.resetTempAttivita();
        this.showAttivitaForm = false;
      },
      error: (err) => console.error("Errore nella creazione dell'attività:", err)
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
      prioritàId: 0,
      personaId: 0,
      tipoAttivitàId: 0,
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
    return stato ? stato.nome : 'N/A';
  }

  getPrioritaNome(prioritaId: number): string {
    const priorita = this.priorita.find(p => p.id === prioritaId);
    return priorita ? priorita.nome : 'N/A';
  }
}