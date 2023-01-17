import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Bloque les pages que l'utilisateur ne peut pas acceder l'orsquil est connecter, comme le login ou le register
 */
@Injectable({
  providedIn: 'root'
})
export class AloneAnonymeGuard implements CanActivate {

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
    const connected = this.auth.isConnected();
    //s'il est connecter on lui laisse avoir acces à la page
    if (!connected==false) {
      // sinon on le redirige sur la page de profil
      this.auth.redirect(this.auth.profilUrl);
    }
    return !connected;
  }
}
