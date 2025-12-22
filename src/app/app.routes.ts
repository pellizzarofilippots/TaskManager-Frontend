import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { ProgettiListComponent } from './component/progetti-list/progetti-list.component';
import { UtentiComponent } from './component/utenti/utenti.component'; //
import { HomeComponent } from './component/home/home.component';
import { AnagraficaComponent } from './component/anagrafica/anagrafica.component';
import { CreaProgettiComponent } from './component/crea-progetti/crea-progetti.component';
import {AggiungiPersoneComponent} from './component/aggiungi-persone/aggiungi-persone.component';
import { GestisciProgettoCoponent } from './component/gestisci-progetto/gestisci-progetto.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path:'login' , component: LoginComponent},
  { path: 'progetti', component: ProgettiListComponent },
 // { path: 'utenti', component: UtentiComponent } ,
  { path: 'home', component: HomeComponent },
  {path: 'anagrafica', component: AnagraficaComponent},
  
  // Nuova route per Utenti con parametro idAnagrafica
  { path: 'utenti/:idAnagrafica', component: UtentiComponent },

  {path:'creaProgetti', component: CreaProgettiComponent},
  {path:'aggiungiPersone/:idProgetto', component:AggiungiPersoneComponent},
  {path:'gestisciProgetto/:idProgetto', component:GestisciProgettoCoponent},
];
