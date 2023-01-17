import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

/**
 * Creer des coockies sur le serveur
 */
@Injectable({
  providedIn: 'root'
})
export class CoockieStorageService {
  public keyJwtToken = 'jwt_token';
  constructor(
    public coockiestorage: CookieService
  ) { }

  // default action

  /**
   * Reccupere un element dans le coockie storage
   * @param key la cle de l'element
   * @returns 
   */
  private get(key : string) {
    const data = this.coockiestorage.get(key);
    if(!!data) {
      return data;
    }
    return null;
  }

  /**
   * Ajoute un element dans le coocki storage
   * @param key la cle de l'element
   * @param value la valeur à enregistrer
   */
  private set(key: string, value : string) {
    this.coockiestorage.set(key, value);
  }

  /**
   * Enleve un element du coockie storage
   * @param key la cley de l'element
   */
  private remove(key: string) {
    this.coockiestorage.delete(key);
  }


  // jwt_token coockie

  /**
   * Reccupere le coockie jwt_token
   * @returns 
   */
  public getJwtToken() {
    return this.get(this.keyJwtToken);
  }

  /**
   * Creer un cookie jwt_token
   * @param value 
   */
  public setJwtToken(value : string ) {
    this.set(this.keyJwtToken, value);
  }

  /**
   * Supprime le coockie jwt_token
   */
  public removeJwtToken() {
    this.remove(this.keyJwtToken);
  }

}
