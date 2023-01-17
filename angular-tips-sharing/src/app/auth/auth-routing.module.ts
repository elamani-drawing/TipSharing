import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AloneAnonymeGuard } from '../core/guards/alone-anonyme.guard';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { PingComponent } from './components/ping/ping.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  // login et register sont disponnible que si la personne n'est pas connecter
  { path: 'login', component: LoginComponent , canActivate : [AloneAnonymeGuard] },  
  // faire la redirection apres la reccuperation du token, preparer le systeme de guards pour les routes reserver au membre et au admins
  { path: 'register', component: RegisterComponent , canActivate : [AloneAnonymeGuard]}, 
  { path: 'logout', component: LogoutComponent }, 
  // { path: 'ping', component: PingComponent }, 
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule {}