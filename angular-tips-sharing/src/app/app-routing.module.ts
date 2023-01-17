import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { AdministrateurGuard } from './core/guards/administrateur.guard';
import { AloneAnonymeGuard } from './core/guards/alone-anonyme.guard';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [  
  // Chargement de la page d'accueil
  { path: '', component: AccueilComponent },
  
  // chargement des routes auth : login, register, logout
  { path: '', loadChildren: () => import('./auth/auth-routing.module').then(m => m.AuthRoutingModule) }, 
  
  // Chargement des routes de l'espace membre : disponnible que si le membre est connecter.
  { path: 'profil', loadChildren: () => import('./membre/membre-routing.module').then(m => m.MembreRoutingModule) , canActivate: [AuthGuard]},
  
  // Chargement des toutes de tips, le guard pour la creation des asutces sera placer dans le modules routings de tips est non ici
  { path: 'tips', loadChildren: () => import('./tips/tips-routing.module').then(m => m.TipsRoutingModule) },

  // Chargement des routes de l'espace admin : accessible que si la personne est connecter et est un admin
  { path: 'admin', loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule) , canActivate: [AuthGuard, AdministrateurGuard]},

  // si aucune route ne match on le redirige vers l'accueil
  // { path: '', pathMatch:'full',  redirectTo : '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
