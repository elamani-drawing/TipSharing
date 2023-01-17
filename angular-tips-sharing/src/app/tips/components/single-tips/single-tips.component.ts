import { Component, OnInit } from '@angular/core';
import { Tip } from 'src/app/tips/models/tip.model';
import { TipsService } from 'src/app/core/services/tips.service';
import { ActivatedRoute } from '@angular/router';
import { Commentaire } from '../../models/commentaire.model';
import { Tag } from '../../models/tag.model';
import { LinkToolsService } from 'src/app/shared/services/link-tools.service';
import { Membre } from 'src/app/shared/models/membre.model';
import { ProfilService } from 'src/app/core/services/profil.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormCheckerService } from 'src/app/shared/services/form-checker.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TipInfo } from '../../models/tip-info.model';
/**
 * Une page affichant toutes les informations d'un tip
 */
@Component({
  selector: 'app-single-tips',
  templateUrl: './single-tips.component.html',
  styleUrls: ['./single-tips.component.css']
})
export class SingleTipsComponent implements OnInit {
  tips: Tip[] = []; // le tips
  id!: string;// l'id du tips
  commentaires: Commentaire[] = []; // les commentaires du tips
  tags: Tag[] = []; // les tags du tips
  user!: Membre; // l'utilisateur connecter
  tipInfo!: TipInfo[];

  // le champs pour poster un commentaire
  commentaireCtrl!: FormControl;
  mainForm!: FormGroup;
  // un boolean qui indique si la saisie dans le textarea est valide pour etre envoyer au serveur
  canCreate: boolean = false;

  constructor(private tipsService: TipsService, private route: ActivatedRoute,
    public linkToolService: LinkToolsService, private profilService: ProfilService,
    private formBuilder: FormBuilder, public formChecker: FormCheckerService,
    public authService: AuthService
  ) { }

  async ngOnInit() {
    await this.getTip();
    this.commentaireCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]);
    this.mainForm = this.formBuilder.group({
      commentaireCtrl: this.commentaireCtrl
    });

    this.commentaireCtrl.valueChanges.subscribe({
      next: () => {
        this.canCreate = this.commentaireCtrl.valid;
      },
    });
  }

  async getTip() {
    let _id = +this.route.snapshot.paramMap.get('id')!;
    let res = this.tipsService.getTip(_id);
    this.tips = res.tips;
    this.tags = res.tags;
    this.tipInfo = res.tipInfo;
    // this.tags = this.tipsService.getTag(_id);
    this.id = '' + _id;
    //reccuperation de tout les commentaires du tip
    this.commentaires = this.tipsService.getCommentaires(_id);
    
    // s'il est valider il est disponnible a tous
    // si la personne est connecter on reccupere ces données
    if (this.authService.connected) {
      this.user = await this.profilService.getMembre()
    }
    return 
  }

  /**
   * fonction qui est appeller a la suppression d'un commentaire
   * @param commentaire le commentaire supprimer 
   */
  eventCommentaireDelete(commentaire: Commentaire) {
    // recopie le tableau sans le commentaire qui pause probleme 
    let _commentaires: Commentaire[] = []
    for (const _commentaire of this.commentaires) {
      if (_commentaire.id != commentaire.id) {
        _commentaires.push(_commentaire);
      }
    }
    this.commentaires = _commentaires;
  }

  /**
   * Poste un commentaire sur le tip
   */
  posteUnCommentaire() {
    let formulaire: FormData = new FormData();
    // enregistrement des données du commentaire
    formulaire.append("content", this.commentaireCtrl.value);
    formulaire.append("tipId", this.id);
    this.canCreate = false;
    this.tipsService.postCommentaire(formulaire)
      .subscribe({
        next: (res: any) => {
          // le commentaire à bien été creer
          if (res.succes) {
            this.commentaires.unshift({
              ...res.payload.commentaire,// recopie les autres champs
              User: this.user // le createur est forcement la personne connecter
            });
          }
        }
      })
  }
}

