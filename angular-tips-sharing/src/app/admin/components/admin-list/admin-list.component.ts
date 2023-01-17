import { Component, OnInit } from '@angular/core';
import { Administrateur } from '../../models/admin.model';
import { AdminService } from '../../services/admin.service';

/**
 * Une page affichant une liste de membres avec un bouton "promouvoir" le faisant devenir admin
 */
@Component({
  selector: 'app-admin-membres',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent implements OnInit {

  // un attribut 
  admins!: Administrateur[];

  constructor(private adminService: AdminService,
  ) { }
  // la fonction qui est appeller a la creation du composant
  ngOnInit(): void {
    this.getAdmins();
  }

  // la fonction 
  getAdmins() {
    // appelle de la fonction du service
    this.admins = this.adminService.getAdmins();
  }

}