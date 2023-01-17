import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Membre } from 'src/app/shared/models/membre.model';
import { LinkToolsService } from 'src/app/shared/services/link-tools.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProfilService {
 

  constructor(
    private http: HttpClient,
    
    private linkToolService: LinkToolsService
    ) { }

  /**
   * Reccupere les informations d'un utilisateur
   * @param pseudo Le pseudo de lutilisateur a reccuperer, ou rien (pour avoir l'utilisateur connecter)
   * @returns Membre | false
   */
  async getMembre(pseudo?: string){
    // let url = `${environment.apiUrl}/membre/profil/${pseudo}`;
    let url = `${environment.apiUrl}/membre/profil`;
    url += pseudo ? `?pseudo=${pseudo}` : '';
    let res : any = await this.http.get(url)
      .pipe()
      .toPromise();
    let membre = res['payload']['user'];
    // si le membre est trouver, on prepare sa photo de profil
    if (membre) {
      membre = <Membre> membre;
      if (!this.linkToolService.isExternalLink(membre.picture)) {
        // c'est le lien du serveur api
        // on reconstruit le lien vers sa photo
        membre.picture = this.linkToolService.buildLinkPictureMember(membre.picture);
      } else {
        // c'est le lien d'une image externe
        // aucune modification on peut charger l'image
      }

      return membre
    } else {
      // redirige sur son profil
      return false
    }
  
  // si on a un utilisateur on le retourne, sinon on retourne null
  // return res['payload']['user'] ;
  }
  editProfile(formData: FormData) {
    return this.http.post(`${environment.apiUrl}/membre/profil/`,formData)
    
  }
}
