import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdministrateurGuard implements CanActivate {

  constructor(
    private auth: AuthService,
  ) {}

/**
 * La methode verifie si l'utilisateur peut acceder à la page
 * @param route 
 * @param state 
 * @returns 
 */
canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  const administrateur = this.auth.isAdmin();
  //s'il est c'est un admin on lui laisse avoir acces à la page
  if (administrateur==false) {
    // sinon on le redirige sur la page de profil
    this.auth.redirect(this.auth.profilUrl);
  }
  return administrateur;
}
  
}
