import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TipsService } from 'src/app/core/services/tips.service';
import { FormCheckerService, TypeOfFile } from 'src/app/shared/services/form-checker.service';

/**
 * Un formulaire permettant de creer un Tip
 */
@Component({
  selector: 'app-new-tips',
  templateUrl: './new-tips.component.html',
  styleUrls: ['./new-tips.component.css']
})
export class NewTipsComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    public formChecker: FormCheckerService,
    private tipsService: TipsService
  ) { }

  raretes!:any;
  types!:any;
  obtentions!:any;
  rareteCtrl!: FormControl;
  typeCtrl!: FormControl;
  obtentionCtrl!: FormControl;

  // le formulaire principal
  mainForm!: FormGroup;
  // les attributs du formulaire
  titleCtrl!: FormControl;
  contentCtrl!: FormControl;
  pictureCtrl!: FormControl;
  pictureValue!: File;
  formulaireMessageError: string = '';
  formulaireMessageSucces: string = '';

  // la liste des tags
  tags: string[] = [];
  tagsMinLength = 2;
  tagsInputError!: any;

  loading: boolean = false;
  formulaireReady = false;

  ngOnInit(): void {
    // reccupere les informations dont nous avons besoins
    this.raretes = this.tipsService.getRaretes();
    this.types = this.tipsService.getTypes();
    this.obtentions = this.tipsService.getObtention();
    // initialise les formControl et les formGroup
    this.initFormControls();
    this.initMainForm();
  }

  /**
   * Initialise le mainForm
   */
  private initMainForm(): void {
    this.mainForm = this.formBuilder.group({
      title: this.titleCtrl,
      content: this.contentCtrl,
      picture: this.pictureCtrl,
      type: this.typeCtrl,
      rarete: this.rareteCtrl,
      obtention: this.obtentionCtrl,
    });
    this.mainForm.statusChanges.pipe().subscribe({
      next: (res: any) => {
        this.formulaireReady = res == "VALID";
      }
    })
  }

  /**
   * Initialise les formControls
   */
  private initFormControls(): void {
    //initialisation des formControl et placement de validator generaux
    this.titleCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(10), Validators.maxLength(65)]);
    this.contentCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(15), Validators.maxLength(600)]);
    this.pictureCtrl = this.formBuilder.control('', [Validators.required]);

    this.obtentionCtrl = this.formBuilder.control("craft", [Validators.required]);
    this.typeCtrl = this.formBuilder.control("Naturel", [Validators.required]);
    this.rareteCtrl = this.formBuilder.control("faible", [Validators.required]);
  }

  /**
   * Verifie les fichiers qui ont etait donner a l'input file (picture)
   * @param event 
   */
  onFileSelected(event: any) {
    //verification du fichier qu'on a recu
    let answer = this.formChecker.checkFileFormValidator(event, this.pictureCtrl, TypeOfFile.Picture);
    if (answer) {
      //il ny a pas derreur, on reccupere la premiere image 
      this.pictureValue = event.target.files[0];
    }
  }

  /**
   * La fonction qui est appeller lorsqu'un tag est ajouter ou enlever
   */
  eventTagUpdate(tags: string[]) {
    this.tags = tags; // ecrase la liste de tags
    let res = this.formChecker.tagsMinLength(this.tags, this.tagsMinLength);
    // si l'utilisateur n'a pas mis assez de tags, on renvoie une erreur
    this.tagsInputError = res;
  }

  /**
   * La fonction appeller à la soumissions du formulaire 
   */
  onSubmitForm() {
    this.loading = true;
    this.formulaireReady = false;
    this.formulaireMessageError = '';
    this.formulaireMessageSucces = '';
    const formData = new FormData();
    let res = this.formChecker.tagsMinLength(this.tags, this.tagsMinLength);
    // si l'utilisateur n'a pas mis assez de tags, on renvoie une erreur
    if (!res.valide) {
      this.loading = false;
      this.formulaireReady = false;
      return this.tagsInputError = res;
    }
    // preparation des données a envoyer
    // preparation du tableau de tags
    this.tags.forEach((tag)=> {
      formData.append('tags', tag)
    })
    formData.append("picture", this.pictureValue, this.pictureValue.name);
    formData.append("title", this.titleCtrl.value);
    formData.append("content", this.contentCtrl.value);

    formData.append("type", this.typeCtrl.value);
    formData.append("rarete", this.rareteCtrl.value);
    formData.append("obtention", this.obtentionCtrl.value);
    // verifie et reccupere les autres champs de ton formulaire
    // execute ta requete
    this.tipsService.createTip(formData)
      .subscribe({
        next: (res: any) => {
          if (res.error) {
            // il y a une erreur
            this.formulaireMessageError = res.messages[0].message;
          } else {
            // le tip a bien etait creer
            this.formulaireMessageSucces = res.messages[0].message;
          }
          this.loading = false;
        }
      });
    return
  }
}
