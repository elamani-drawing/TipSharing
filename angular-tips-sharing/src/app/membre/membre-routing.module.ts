import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionTipsComponent } from './components/gestion-tips/gestion-tips.component';
import { ProfilEditComponent } from './components/profil-edit/profil-edit.component';
import { ProfilIdentifiantComponent } from './components/profil-identifiant/profil-identifiant.component';
import { ProfilComponent } from './components/profil/profil.component';
/**
 * Declaration des differentes routes pour les membres
 */
const routes: Routes = [
  { path: 'edit', component: ProfilEditComponent },
  { path: 'identifiants', component: ProfilIdentifiantComponent  },
  { path: 'gestion-tips', component: GestionTipsComponent  },
  { path: ':pseudo', component: ProfilComponent },
  { path: '', component: ProfilComponent },
  // { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] }, //essaynt de d'abbord melanger les 2 routes puis si c'est compliquer on les separes en deux
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembreRoutingModule { }
