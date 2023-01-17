import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipsService } from 'src/app/core/services/tips.service';
import { LinkToolsService } from 'src/app/shared/services/link-tools.service';
import { Tip } from '../../models/tip.model';

@Component({
  selector: 'app-tip-sup-val',
  templateUrl: './tip-sup-val.component.html',
  styleUrls: ['./tip-sup-val.component.css']
})
export class TipSupValComponent implements OnInit {

  // tips!: Tip[];
  // les tips a afficher
  @Input() tips!: Tip[];
  // si le bouton valider doit etre afficher ou non 
  @Input() canValidate!: boolean; 

  constructor(
    private tipsService: TipsService,
    private router: Router,
    public linkToolService: LinkToolsService
  ) { }

  ngOnInit(): void {
  }

  /**
   * Navigue vers la page de profil du tip
   * @param id l'id du tip
   */
  onViewTip(id:number): void {
    this.router.navigateByUrl(`/tips/${id}`)
  }

  /**
   * Permet de supprimer un tip
   * @param id l'id du tip a supprimer
   */
  deleteTip(id:number) {
    // let data = new FormData();
    // data.append("tipId", ""+id);
    this.tipsService.deleteTip(id);
    this.tips = this.tipsService.removeTip(this.tips, id);
  }
  
  /**
   * Permet de valider un tip
   * @param id l'id du tip a vaider
   */
  valideTip(id:number) {
    let data = new FormData();
    data.append("tipId", ""+id);
    this.tipsService.valideTip(data);
    this.tips = this.tipsService.removeTip(this.tips, id);
  }
}