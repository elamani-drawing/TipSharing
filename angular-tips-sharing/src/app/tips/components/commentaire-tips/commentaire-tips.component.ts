import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TipsService } from 'src/app/core/services/tips.service';
import { Membre } from 'src/app/shared/models/membre.model';
import { LinkToolsService } from 'src/app/shared/services/link-tools.service';
import { Commentaire } from '../../models/commentaire.model';
import { Tip } from '../../models/tip.model';

/**
 * Un composant commentaire pour les tips
 */
@Component({
  selector: 'app-commentaire-tips',
  templateUrl: './commentaire-tips.component.html',
  styleUrls: ['./commentaire-tips.component.css']
})
export class CommentaireTipsComponent implements OnInit {
  @Input() commentaire!: Commentaire;
  @Input() tip!: Tip;
  @Input() user!: Membre;
  @Input() index!: number;
  // evenement declencher a la suppression du commentaire
  @Output() commentaireDeleteEmitter = new EventEmitter<Commentaire>();

  constructor(
    public linkToolService: LinkToolsService,
    private tipsService: TipsService
  ) { }
  ngOnInit(): void {
  }

  /**
   * Supprime le commentaire
   */
  delete() {
    this.tipsService.deleteCommentaire(this.commentaire.id);
    // emission de la suppression vers le component parent
    this.commentaireDeleteEmitter.emit(this.commentaire);
  }
}
