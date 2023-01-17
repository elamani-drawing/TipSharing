import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminListComponent } from './components/admin-list/admin-list.component';
import { AdminMembresComponent } from './components/admin-membres/admin-membres.component';
import { AdminTipsComponent } from './components/admin-tips/admin-tips.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'admin-list', component: AdminListComponent },
  { path: 'tips', component: AdminTipsComponent },
  // { path: 'tips/:id', component: AdminSingleTipsComponent },
  { path: 'membres', component: AdminMembresComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }