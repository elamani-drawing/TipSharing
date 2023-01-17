import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { pseudoValidator } from 'src/app/auth/validators/pseudo.validator';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfilService } from 'src/app/core/services/profil.service';
import { Membre } from 'src/app/shared/models/membre.model';
import { formatArrayString, FormCheckerService, TypeOfFile } from 'src/app/shared/services/form-checker.service';
import { LinkToolsService } from 'src/app/shared/services/link-tools.service';

/**
 * Une page permettant à l'utilisateur de mettre à jour ces informations
 */
@Component({
  selector: 'app-profil-edit',
  templateUrl: './profil-edit.component.html',
  styleUrls: ['./profil-edit.component.css']
})
export class ProfilEditComponent implements OnInit {

  membre!: Membre;
  // formualaire
  // formulaireprincipal
  mainForm!: FormGroup;

  // les form controlle pour les input du formulaire
  firstNameCtrl!: FormControl;
  lastNameCtrl!: FormControl;
  pseudoCtrl!: FormControl;
  pictureCtrl!: FormControl;
  pictureValue!: File;

  pictureTypeFile: TypeOfFile = TypeOfFile.Picture;

  // formReady: boolean = false;
  // newProfilPreview$!: Observable<Membre>;

  messageSuccesServer: string = "";
  messageErrorServer: string = "";
  messageInfoFormulaire: string = "";

  constructor(
    public http: HttpClient,
    private router: Router,
    private profileService: ProfilService,
    private formBuilder: FormBuilder,
    public formChecker: FormCheckerService,
    private authService: AuthService,
    private linkToolService: LinkToolsService
  ) {

  }

  async ngOnInit() {
    await this.getMembre();
    this.initFormControls();
  }

  /**
   * recc un menbre de la base de donnee
   */
  async getMembre() {
    // tentative de reccuperer le membre
    this.membre = await this.profileService.getMembre();
    // le membre n'a pas etait trouver
    if (!this.membre) {
      // redirige sur son profil
      this.router.navigateByUrl('profil');
    }
  }

  /**
   * Initialisation des controls
   */
  private initFormControls(): void {
    // le formulaire pour le changement de mot de passe
    // validator pour le firstName
    this.firstNameCtrl = this.formBuilder.control('', [Validators.minLength(1), Validators.maxLength(30)]);
    // validator pour le lastName
    this.lastNameCtrl = this.formBuilder.control('', [Validators.minLength(1), Validators.maxLength(20)]);
    // validator pour l'image
    this.pictureCtrl = this.formBuilder.control('', []);
    this.pseudoCtrl = this.formBuilder.control('', [Validators.minLength(2), Validators.maxLength(15), pseudoValidator()]);

    // le formulaire
    this.mainForm = this.formBuilder.group({
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      picture: this.pictureCtrl,
      pseudo: this.pseudoCtrl
    });

    // la preview du profil
    this.mainForm.valueChanges.subscribe({
      next: (formValue) => {
        let attributes = this.formChecker.notEmptyAttributeForm(this.mainForm, true);
        // si picture n'est pas valide, on ne le comptabilise pas
        if(!this.pictureCtrl.valid){
          attributes = attributes.filter(function(value, index, arr){ 
            return value != "picture";
        });
        }
        this.messageInfoFormulaire = attributes.length > 0 ? `Les champs qui seront mis à jour sont : ${formatArrayString(attributes, 'conjunction')}` : ""
      }
    });
  }


  /**
   * Verifie les fichiers qui ont etait donner a l'input file (picture)
   * @param event 
   */
  onFileSelected(event: any) {
    //verification du fichier qu'on a recu
    let answer = this.formChecker.checkFileFormValidator(event, this.pictureCtrl, this.pictureTypeFile);
    if (answer) {
      //il ny a pas derreur, on reccupere la premiere image 
      this.pictureValue = event.target.files[0];
    }
  }

  onSubmit() {
    this.messageErrorServer = "";
    this.messageSuccesServer = "";
    // on execute la requete que si on a au moin un element qui a ete saisie

    if (this.formChecker.notEmptyAttributeForm(this.mainForm).length == 0) {
      // aucun element n'a ete saisie
      this.messageSuccesServer = "Aucune modification n'a été apporté."
      return
    }
    
    const formData = new FormData();
    // on recoit une nouvelle photo de profil
    if (this.pictureCtrl && this.pictureValue && !this.formChecker.inputIsValid(this.pictureCtrl)) formData.append("picture", this.pictureValue, this.pictureValue.name);
    // on recoit un nouveau last name
    if (!this.formChecker.inputIsValid(this.lastNameCtrl) && this.lastNameCtrl.value != "") formData.append("lastName", this.lastNameCtrl.value);
    // on recoit une nouveau first name
    if (!this.formChecker.inputIsValid(this.firstNameCtrl) && this.firstNameCtrl.value != "") formData.append("firstName", this.firstNameCtrl.value);
    // on recoit une nouveau pseudo
    if (!this.formChecker.inputIsValid(this.pseudoCtrl) && this.pseudoCtrl.value != "") formData.append("newPseudo", this.pseudoCtrl.value);
    this.profileService.editProfile(formData).subscribe({
      next: (res: any) => {
        if (res.error) {
          // une erreur est survenu, on l'affiche a l'utilisateur
          this.messageErrorServer = res.messages[0].message;
        } else {
          
          let user = res.payload.refreshData.user;
          // if (res.payload.historique.values.includes("picture")) {
          if (!this.linkToolService.isExternalLink(user.picture)) {
            // c'est le lien du serveur api
            // on reconstruit le lien vers sa photo
            user.picture = this.linkToolService.buildLinkPictureMember(user.picture);
          }
          // }
          this.membre = <Membre> user;
          // tout a pu etre modifier sans probleme
          this.messageSuccesServer = "Toutes les modifications ont été sauvegarder.";
          // si le pseudo à été changer, on modifie le jwt token
          if (res.payload.refreshData.jwt) {
            // met à jour le token du service
            this.authService.setJwtToken(res.payload.refreshData.jwt.token);
            // met à jour les coockies de l'application
            this.authService.coockiestorage.setJwtToken(res.payload.refreshData.jwt.token);
            // met à jour les informations auth du local storage
            this.authService.localstorage.setAuthData({ 'xsrfToken': res.payload.refreshData.jwt.xsrf, 'isAdmin': res.payload.refreshData.jwt.isAdmin });
            // actualise les données du Service
            this.authService.actualiseAuthService();
          }
        }
      }
    })
  }
}
