import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Administrateur } from '../models/admin.model';
import { Membre } from 'src/app/shared/models/membre.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  getAdmin(): Administrateur[] {
    throw new Error('Method getAdmin not implemented.');
  }

  getMembre(): Membre[] {
    throw new Error('Method getMembre not implemented');
  }

  constructor(
    public http: HttpClient,
    private router: Router
  ) { }


  getAdmins() {
    let admin: Administrateur[] = [];
    this.http.get(
      `${environment.apiUrl}/admin`
    ).pipe() // retour de la requete
      .subscribe({
        // le retour de la requete s'il ny a pas eu derreur serveur
        next: (res: any) => {
          let admins = res.payload.administrateur;
          if (!!admins == true) {
            // il y a au moins un admin en base de données
            if (Array.isArray(admins)) {
              for (const _admin of admins) {
                admin.push({
                  ..._admin
                }) // recopie et converti les données
              }
            } else {
              admin.push(admins);
            }
          }
          // si le serveur a soulever une erreur
          error: (err: any) => {
            console.log("la requete de reccuperation des admin a echouer", err);
          }
        }
      });
    return admin;
  }

  getMembres() {
    return this.http.get(
      `${environment.apiUrl}/admin/user`
    ).pipe() // retour de la requete
  }

  adminBanOrUnbanMember(membre: { id: number }) { // la methode a besoin de prendre en parametre l'id du membre a bannir
    return this.http.post(
      `${environment.apiUrl}/admin/user/ban`, membre
    ).pipe()
  }

  adminAdd(username: string) {
    return this.http.post(
      `${environment.apiUrl}/admin/user/promote`, {username}
    ).pipe()
  }

}