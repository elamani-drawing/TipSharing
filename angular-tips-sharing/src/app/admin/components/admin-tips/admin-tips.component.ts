import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfilService } from 'src/app/core/services/profil.service';
import { TipsService } from 'src/app/core/services/tips.service';
import { Membre } from 'src/app/shared/models/membre.model';
import { Tip } from 'src/app/tips/models/tip.model';


/**
 * Une liste de tips qu'on peut accepter ou refuser
 */
@Component({
  selector: 'app-admin-tips',
  templateUrl: './admin-tips.component.html',
  styleUrls: ['./admin-tips.component.css']
})
export class AdminTipsComponent implements OnInit {
  tips: Tip[] =[];
  user!: Membre;
  constructor(private http: HttpClient, private router: Router, public tipsService: TipsService, private authService: AuthService, private profilService: ProfilService) { }

  async ngOnInit() {
    this.user = await this.profilService.getMembre();
    this.tips = this.tipsService.getTipsInvalide();
  }
}
