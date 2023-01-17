import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfilService } from 'src/app/core/services/profil.service';
import { ActivatedRoute } from "@angular/router";
import { Membre } from 'src/app/shared/models/membre.model';
import { TipsService } from 'src/app/core/services/tips.service';
import { Tip } from 'src/app/tips/models/tip.model';

/**
 * La page d'affichage du profil de l'utilisateur
 */
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  membre!: Membre;
  pseudo!: string;
  tips_profil: Tip[]= [];


  constructor(
    public http: HttpClient,
    private router: Router,
    private profileService: ProfilService,
    private route: ActivatedRoute,
    private tipsService: TipsService
  ) {

  }

  async ngOnInit() {
    let _pseudo = this.route.snapshot.paramMap.get('pseudo')!;
    this.pseudo = _pseudo ? _pseudo : '';
    await this.getMembre();
    await this.getTips();
  }  

  /**
   * reccupere un menbre de la base de donnee
   */
  async getMembre() {
    // tentative de reccuperer le membre
    this.membre = await this.profileService.getMembre(this.pseudo);
    // le membre n'a pas etait trouver
    if (!this.membre) {
      // redirige sur son profil
      this.router.navigateByUrl('profil'); 
    }
  }

  
  /**
   * Reccupere les tips de la bdd
   */
  getTips(): void {
    this.tips_profil = this.tipsService.getTipsOfMember(this.membre.pseudo);
  }
}
