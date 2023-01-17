import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';


/**
 * Realise les requetes pour les formulaires de login et register
 * Initialise les valeurs des tokens du AuthService
 */
@Injectable({
  providedIn: 'root'
})
export class LoginRegisterService {

  constructor(public authService : AuthService) { }
  
  /**
   * Realise une connexion sur le serveur (demande un token)
   * @param formulaire Un FormData avec les données à envoyer
   */
  login(formulaire: FormData): Observable<any> {
    // this.token = 'MyFakeToken';
    return this.authService.http.post(
      `${environment.apiUrl}/login`, 
      formulaire
      ).pipe(); // laisse la methode appellante s'occuper de souscrire sur l'observable et traiter le resultat de la requete
  }
  
  /**
   * Realise une inscription sur le site (creation d'un utilisateur dans la bdd)
   * @param formulaire  Un FormData avec les données à envoyer
   */
  register(formulaire: FormData): Observable<any> {
    return this.authService.http.post(
      `${environment.apiUrl}/register`,
      formulaire
    ).pipe(); // laisse la methode appellante s'occuper de souscrire sur l'observable et traiter le resultat de la requete
  }

  ping(){
    this.authService.http.get(
      `${environment.apiUrl}/membre/profil`
    ).pipe().subscribe({
      next : (res : any) => {
        console.log("--resultat du ping",res);
      }, 
      error: (err) => {
        console.log("--erreur du ping", err);
      }
    })
  }
}
