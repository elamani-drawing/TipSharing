import { Component, OnInit } from '@angular/core';
import { ProfilService } from 'src/app/core/services/profil.service';
import { Membre } from 'src/app/shared/models/membre.model';

/**
 * Composant d'ecrivant l'apparence d'un element du composant AdminListComponent
 */
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  membre!: Membre;
  constructor(
    private profileService: ProfilService,
  ) { }
  async ngOnInit() {
    this.membre = await this.profileService.getMembre();
  }


}