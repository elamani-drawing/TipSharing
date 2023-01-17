import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private localstorage = localStorage;
  private keyAuthData = 'Auth';
  constructor() { 

  }

  // default action 
  
  /**
   * Reccupere un element dans le localStorage
   * @param key la cle de l'element
   * @returns 
   */
  private get(key : string) {
    const data = this.localstorage.getItem(key);
    if(data != null) {
      return JSON.parse(data);
    }
    return null;
  }

  /**
   * Ajoute un element dans le local storage
   * @param key la cle de l'element
   * @param value la valeur à enregistrer
   */
  private set(key: string, value : any) {
    this.localstorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Enleve un element du localStorage
   * @param key la cley de l'element
   */
  private remove(key: string) {
    this.localstorage.removeItem(key);
  }


  // Auth data
  /**
   * Modifie lelement Auth dans le localStorage
   * @param data 
   */
  setAuthData(data : any) {
    this.set(this.keyAuthData, data);
  }

  /**
   * Reccupere le contenu Auth du localStorage
   * @returns 
   */
  getAuthData() {
    return this.get(this.keyAuthData);
  }

  /**
   * Supprime les données keyAuthData du localStorage
   */
  removeAuthData() {
    this.remove(this.keyAuthData);
  }


}
