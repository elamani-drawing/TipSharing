import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LinkToolsService {
  /**
   * Indique si un lien est externe a l'application ou pas
   * @param link le lien a verifier
   */
  isExternalLink(link: string): boolean {
    // es ce que c'est l'url d'api? 
    // es ce que c'est l'uril du client?
    if ((link.slice(0, environment.apiUrl.length) != environment.apiUrl) && (link.slice(0, environment.clientUrl.length) != environment.clientUrl)) {
      // on a un lien qui ne match pas avec nos domain
      // es ce que c'est un lien complet ?
      if(this.beginStartHttp(link)) {
        // oui donc c'est sur il n'est pas de notre api
        // sinon c'est un lien pointant vers un sous dossier de /media/ ou une erreur 
        return true ;
      }
    }
    // le lien fais parti de nos domains
    return false
  }
  /**
   * Indique si un lien commence par http ou non
   * @param link le line à verifier
   */
  beginStartHttp(link: string){
    if(link.slice(0, "http".length)=="http") {
      return true ;
    }
    return false
  }

  /**
   * retourne un lien vers le dossier picture des membres pointant sur name
   */
  buildLinkPictureMember(name: string): string {
    return `${environment.apiUrl}/media/upload/userPDP/${name}`;
  }

  /**
   * retourne un lien vers le dossier picture des tip pointant sur name
   */
  buildLinkPictureTip(name: string): string {
    return `${environment.apiUrl}/media/upload/tipsPicture/${name}`;
  }

  constructor() { }
}
