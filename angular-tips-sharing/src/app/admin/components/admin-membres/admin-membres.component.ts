import { Component, OnInit } from '@angular/core';
import { Membre } from 'src/app/shared/models/membre.model';
import { AdminService } from '../../services/admin.service';

/**
 * Une page affichant une liste de membres avec un bouton "promouvoir" le faisant devenir admin
 */
@Component({
  selector: 'app-admin-membres',
  templateUrl: './admin-membres.component.html',
  styleUrls: ['./admin-membres.component.css']
})
export class AdminMembresComponent implements OnInit {

  membres: Membre[] = [];
  http: any;

  constructor(private adminService: AdminService,
  ) { }

  // la fonction qui est appeller a la creation du composant
  ngOnInit(): void {
    this.getMembres();
  }

  getMembres() {
    // appelle de la fonction du service
    this.adminService.getMembres()
      .subscribe({
        // le retour de la requete s'il ny a pas eu derreur serveur
        next: (res: any) => {
          let membres = res.payload.users; // Object qui contient tous les utilisateurs enregistrés dans la bdd
          if (!!membres == true) {
            // il y a au moins un membre en base de données
            if (Array.isArray(membres)) {
              for (const _membre of membres) {
                this.membres.push({
                  ..._membre
                }) // recopie et converti les données
              }
            } else {
              this.membres.push(membres);
            }
          }
          // si le serveur a soulever une erreur
          error: (err: any) => {
            console.log("la requete de reccuperation des membres a echouer", err);
          }
        }
      });
    return this.membres;
  }

  adminBanOrUnbanMember(membre: { id: number }) { // la methode a besoin de prendre en parametre l'id du membre a bannir
    this.adminService.adminBanOrUnbanMember(membre)
      .subscribe({
        next: (res: any) => {
          alert(res.messages[0].message); // indique que l'utilisateur a été banni dans un pop-up
          window.location.reload(); // permet de recharger automatiquement la page afin de mettre à jour la valeur du bouton
        }
      })
  }

  adminAdd(username: string ) {
    this.adminService.adminAdd(username)
    .subscribe({
      next: (res: any) => {
        alert(res.messages[0].message);
        window.location.reload();
      }
    })
  }

}