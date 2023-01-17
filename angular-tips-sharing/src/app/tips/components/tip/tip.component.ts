import { Component, Input, OnInit } from '@angular/core';
import { Tip } from 'src/app/tips/models/tip.model';
import { TipsService } from 'src/app/core/services/tips.service';
import { Router } from '@angular/router';
import { LinkToolsService } from 'src/app/shared/services/link-tools.service';

/**
 * Un composant decrivant l'apparence d'un element Tip pour le composant tips-list
 */
@Component({
  selector: 'app-tip',
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.css']
})
export class TipComponent implements OnInit {
  @Input() tip!: Tip; 
  
  constructor(
    private tipsService: TipsService, 
    private router: Router,
    public linkToolService: LinkToolsService
    ) { }

  ngOnInit(): void {
  }

  /**
   * Navigue vers la page de profil du tip
   */
  onViewTip () : void {
    this.router.navigateByUrl(`tips/${this.tip.id}`)
  }

}