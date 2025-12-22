import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router'; 
import { UtentiService } from '../../services/utenti.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  template: `
    <h2>Login</h2>
    <input [(ngModel)]="username" placeholder="Username"><br><br>
    <input [(ngModel)]="password" placeholder="Password" type="password"><br><br>
    <button (click)="doLogin()">Login</button>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router, private utente: UtentiService) {}

doLogin() {
  console.log('Invio credenziali:', this.username, this.password); 

  this.auth.login(this.username, this.password).subscribe({
    next: () => {
      console.log('Login riuscito');

             this.router.navigate(['/home']);

     /* // Recupera il ruolo dell'utente tramite UtentiService
      this.utente.getRuoloUtente(this.username).subscribe({
        next: (ruoloId) => {
          
              console.log('Ruolo utente:', ruoloId);

             // SALVA IL RUOLO GIUSTO
    localStorage.setItem('ruolo', ruoloId.toString());
          

          // Salva anche l'username (opzionale, già fatto in AuthService)
          //localStorage.setItem('username', this.username);

             this.router.navigate(['/home']);

        },
        error: (err) => {
          console.error('Errore recupero ruolo utente:', err);
          alert('Errore nel recupero dei dati utente');
        }
      });*/
    },
    error: (err) => {
      console.log('Errore login:', err);
      alert('Credenziali errate');
    }
  });
}

}

