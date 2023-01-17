import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembreRoutingModule } from './membre-routing.module';
import { ProfilComponent } from './components/profil/profil.component';
import { ProfilEditComponent } from './components/profil-edit/profil-edit.component';
import { SharedModule } from '../shared/shared.module';
import { TipsModule } from '../tips/tips.module';
import { ProfilInfoComponent } from './components/profil-info/profil-info.component';
import { ProfilIdentifiantComponent } from './components/profil-identifiant/profil-identifiant.component';
import { GestionTipsComponent } from './components/gestion-tips/gestion-tips.component';


@NgModule({
  imports: [
    CommonModule,
    MembreRoutingModule,
    TipsModule,
    SharedModule
  ],
  declarations: [
    ProfilComponent,
    ProfilEditComponent,
    ProfilInfoComponent,
    ProfilIdentifiantComponent,
    GestionTipsComponent
  ],
  exports: [ 
    ProfilComponent,
    ProfilEditComponent,
    ProfilInfoComponent
  ]
})
export class MembreModule { }
