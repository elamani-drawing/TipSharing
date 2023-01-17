import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CoockieStorageService } from './coockie-storage.service';
// import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // les urls utiles 
  profilUrl: string = '/profil';
  loginUrl: string = '/login';
  registerUrl: string = '/register'
  connected: boolean = false;

  // les tokens
  private jwtToken!: string | null;
  private xsrfToken!: string | null;
  private coockieToken!: string | null;
  private admin = false; // par defaut ce n'est pas un admin

  constructor(
    public http: HttpClient,
    private router: Router,
    public localstorage: LocalStorageService,
    public coockiestorage: CoockieStorageService
  ) {
    this.actualiseAuthService();
  }

  /**
   * Réenitialise toutes les valeurs de AuthService
   */
  private reset() {
    this.setJwtToken(null);
    this.setXsrfToken(null);
    this.setXsrfToken(null);
    this.localstorage.removeAuthData();
    this.coockiestorage.removeJwtToken();
    this.connected = false;
    this.admin = false;
  }

  actualiseAuthService() {
    // tentative de reccuperer le xsrfToken
    const authStorage = this.localstorage.getAuthData();
    let _xsrfToken = authStorage ? authStorage['xsrfToken'] : null;
    if (_xsrfToken != null) {
      this.setXsrfToken(_xsrfToken);
      // Si on a un xsrf token, on essaye de reccuperer le coockie 
      if (this.getXsrfToken()) {
        const coockie = this.coockiestorage.getJwtToken();
        // Si on a un coockie, on passe sa valeur au jwtToken
        if (!!coockie) {
          // configure les attributs du service
          this.setCoockieToken(coockie);
          this.setJwtToken(coockie);
          this.setAdminValue(authStorage['isAdmin'] ? authStorage['isAdmin'] : false);
          this.connected = true;
        }
        return
      }
    }
    // Si on a pas de xsrf ou de coockie, on supprime toutes les données
    // supprime toutes les données de connexion
    this.reset();
  }

  /**
   * Realise une redirection
   * @param lien le lien de destination
   */
  redirect(lien: string): void {
    this.router.navigate([lien]);
  }

  /**
   * Deconnecte l'utilisateur et le redirige sur la page de connexion
   */
  logout(): void {
    // supprime toutes les données de connexion
    this.reset();
    this.redirect(this.loginUrl);
  }

  /**
   * Reccuperer le jwt token
   * @returns string | null
   */
  getJwtToken(): string | null {
    return this.jwtToken;
  }

  /**
   * Remplace la valeur du token
   * @param _jwtToken la nouvelle valeur du jwt token
   */
  setJwtToken(_jwtToken: string | null): void {
    this.jwtToken = _jwtToken;
  }

  /**
   * Reccuperer le token
   * @returns string | null
   */
  getXsrfToken(): string | null {
    return this.xsrfToken;
  }

  /**
   * Remplace la valeur du token xsrf
   * @param _xsrfToken la nouvelle valeur du token xsrf
   */
  setXsrfToken(_xsrfToken: string | null): void {
    this.xsrfToken = _xsrfToken;
  }
  /**
   * Reccuperer le coockie
   * @returns string | null
   */
  getCoockieToken(): string | null {
    return this.coockieToken;
  }

  /**
   * Remplace la valeur du coockie
   * @param _coockie la nouvelle valeur du coockie
   */
  setCoockieToken(_coockie: string | null): void {
    this.coockieToken = _coockie;
  }

  /**
   * Retourne l'attribut admin permettant de s'avoir si l'utilisateur connecter est un admin ou non
   * @returns boolean
   */
  isAdmin(): boolean {
    return this.admin;
  }

  /**
   * Modifie l'attribut admin (ne modifie pas la valeur en bdd)
   * @param valeur boolean
   */
  setAdminValue(valeur: boolean) {
    this.admin = valeur;
  }

  isConnected(): boolean {
    return this.connected;
  }
}