import { Component, Input, OnInit } from '@angular/core';
import { Tip } from 'src/app/tips/models/tip.model';
import { TipsService } from 'src/app/core/services/tips.service';

/**
 * Une liste de tips, utiliser dans tips-list-page et la page de profil
 */
@Component({
  selector: 'app-tips-list',
  templateUrl: './tips-list.component.html',
  styleUrls: ['./tips-list.component.css']
})
export class TipsListComponent implements OnInit{
  // liste de tips que l'on recoit du composant parent
  @Input() tips_list!: Tip[]; 
  
  constructor(private tipsService: TipsService) { }

  ngOnInit(): void {
  }
}
