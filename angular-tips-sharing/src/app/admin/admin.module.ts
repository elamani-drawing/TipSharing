import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './components/admin/admin.component';
import { AdminListComponent } from './components/admin-list/admin-list.component';
import { AdminTipsComponent } from './components/admin-tips/admin-tips.component';
import { AdminMembresComponent } from './components/admin-membres/admin-membres.component';
import { AdminSingleTipsComponent } from './components/admin-single-tips/admin-single-tips.component';
import { MembreModule } from '../membre/membre.module';
import { TipsModule } from '../tips/tips.module';


@NgModule({
  declarations: [
    AdminComponent,
    AdminListComponent,
    AdminTipsComponent,
    AdminMembresComponent,
    AdminSingleTipsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MembreModule,
    TipsModule
  ], 
  exports : [
    AdminComponent,
    AdminListComponent,
    AdminTipsComponent,
    AdminMembresComponent,
    AdminSingleTipsComponent
  ]
})
export class AdminModule { }
