import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { TipsService } from 'src/app/core/services/tips.service';
import { Tip } from '../../models/tip.model';

/**
 * Page d'affichage des tips en base de données
 */
@Component({
  selector: 'app-tips-list-page',
  templateUrl: './tips-list-page.component.html',
  styleUrls: ['./tips-list-page.component.css']
})
export class TipsListPageComponent implements OnInit {
  // la liste des tips qu'on recoit de la bdd
  tips_liste_page_initial: Tip[] = [];
  //ce qui est afficher apres le filtrage
  tips_liste_page: Tip[] = [];

  // pour le filtre
  searchCtrl!: FormControl;

  constructor(
    private tipsService: TipsService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getTips();
    this.searchCtrl = this.formBuilder.control('');
    this.initSearchEvent();
  }

  /**
   * Initialise et ecoute les ecritures sur l'input de recherche
   */
  private initSearchEvent() {
    // ecoute sur les changement de valeur de l'input
    this.searchCtrl.valueChanges.subscribe({
      next: (recherche)=> {
        recherche = recherche.toLowerCase();
        this.tips_liste_page = [];
        for (const tips of this.tips_liste_page_initial) {
          // si le mot est dans le titre ou l'astuce, on le garde, sinon on le filtre
          if(tips.title.toLocaleLowerCase().includes(recherche) || tips.astuce.toLocaleLowerCase().includes(recherche)){
            this.tips_liste_page.push(tips);
          }
        }
      },
    });
  }

  /**
   * Reccupere les tips de la bdd
   */
  getTips(): void {
    this.tips_liste_page_initial = this.tipsService.getTips();
    this.tips_liste_page = this.tips_liste_page_initial;
  }
}

