/*import { Component, OnInit } from '@angular/core';
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
}*/
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { ProgettiService, Progetto } from '../../services/progetti.service';

@Component({
  selector: 'app-progetti-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './progetti-list.component.html',
  styleUrls: ['./progetti-list.component.css']
})
export class ProgettiListComponent implements OnInit {
  progetti: Progetto[] = [];
  editingId: number | null = null;
  isCreating: boolean = false;

  newProgetto: Progetto = {
    nome: '',
    descrizione: '',
    inizio: '',
    fine: '',
    responsabileId: undefined,
    assegnazioni: []
  };

  editingProgetto: Progetto = {
    nome: '',
    descrizione: '',
    inizio: '',
    fine: '',
    responsabileId: undefined,
    assegnazioni: []
  };

  constructor(private progettiService: ProgettiService) {}

  ngOnInit(): void {
    this.loadProgetti();
  }

  loadProgetti(): void {
    this.progettiService.getAll().subscribe(data => {
      console.log('Progetti caricati:', data);
      this.progetti = data;
    });
  }

  startCreating(): void {
    this.isCreating = true;
    this.editingId = null;
  }

  cancelCreate(): void {
    this.isCreating = false;
    this.newProgetto = {
      nome: '',
      descrizione: '',
      inizio: '',
      fine: '',
      responsabileId: undefined,
      assegnazioni: []
    };
  }

  createProgetto(): void {
    if (!this.newProgetto.nome || !this.newProgetto.inizio) {
      alert("Nome e data inizio sono obbligatori!");
      return;
    }

    this.progettiService.create(this.newProgetto).subscribe({
      next: created => {
        this.progetti.push(created);
        this.cancelCreate();
      },
      error: err => {
        console.error("Errore creazione progetto:", err);
        alert("Errore durante la creazione del progetto");
      }
    });
  }

  startEditing(progetto: Progetto): void {
    this.editingId = progetto.id!;
    this.isCreating = false;
    this.editingProgetto = { ...progetto };
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingProgetto = {
      nome: '',
      descrizione: '',
      inizio: '',
      fine: '',
      responsabileId: undefined,
      assegnazioni: []
    };
  }

  saveEdit(): void {
    if (!this.editingProgetto.nome || !this.editingProgetto.inizio) {
      alert("Nome e data inizio sono obbligatori!");
      return;
    }

    this.progettiService.update(this.editingId!, this.editingProgetto).subscribe({
      next: updated => {
        const index = this.progetti.findIndex(p => p.id === this.editingId);
        if (index !== -1) {
          this.progetti[index] = updated;
        }
        this.cancelEdit();
      },
      error: err => {
        console.error("Errore aggiornamento progetto:", err);
        alert("Errore durante l'aggiornamento del progetto");
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Sei sicuro di voler eliminare questo progetto?')) {
      return;
    }

    this.progettiService.delete(id).subscribe({
      next: () => {
        this.progetti = this.progetti.filter(p => p.id !== id);
      },
      error: err => {
        console.error("Errore eliminazione progetto:", err);
        alert("Errore durante l'eliminazione del progetto");
      }
    });
  }

  isAdmin(): boolean {
    return Number(localStorage.getItem('ruolo')) === 1;
  }
}