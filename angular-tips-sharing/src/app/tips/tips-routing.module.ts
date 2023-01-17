import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { NewTipsComponent } from './components/new-tips/new-tips.component';
import { SingleTipsComponent } from './components/single-tips/single-tips.component';
// import { TagInputComponent } from './components/tag-input/tag-input.component';
import { TipsListPageComponent } from './components/tips-list-page/tips-list-page.component';

const routes: Routes = [
  { path: '', component: TipsListPageComponent }, // la page qui affiche la liste des tips
  // { path: 'tags', component: TagInputComponent }, // liste des tips
  { path: 'new', component: NewTipsComponent , canActivate : [AuthGuard]}, // ajouter un tip
  { path: ':id', component: SingleTipsComponent }, // le profil d'un tip
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipsRoutingModule { }
