import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { confirmEqualValidator } from 'src/app/auth/validators/confirm-equal.validator';
import { passwordValidator } from 'src/app/auth/validators/password.validator';
import { ProfilService } from 'src/app/core/services/profil.service';
import { Membre } from 'src/app/shared/models/membre.model';
import { FormCheckerService } from 'src/app/shared/services/form-checker.service';

@Component({
  selector: 'app-profil-identifiant',
  templateUrl: './profil-identifiant.component.html',
  styleUrls: ['./profil-identifiant.component.css']
})
export class ProfilIdentifiantComponent implements OnInit {

  membre!: Membre;
  pseudo!: string;

  // formualaire
  // formulaireprincipal
  mainForm!: FormGroup;

  // formulaire du mot de passe
  passwordCtrl!: FormControl;
  newPasswordCtrl!: FormControl;
  confirmNewPasswordCtrl!: FormControl;
  passwordForm!: FormGroup;

  // formulaire pour lemail
  emailCtrl!: FormControl;
  newEmailCtrl!: FormControl;
  confirmNewEmailCtrl!: FormControl;
  emailForm!: FormGroup;

  // Message d'erreur
  showPasswordError$!: Observable<boolean>;
  showEmailError$!: Observable<boolean>;

  // pour la gestion des message d'erreur provenant du serveur
  showMessageServeur: { error: boolean, formulaire: string, message: string } = this.initMessageServeur();

  // pour activer et desactiver les boutons de validation
  loadingEmail: boolean = false;
  loadingPassword: boolean = false;

  constructor(
    public http: HttpClient,
    private router: Router,
    private profileService: ProfilService,
    private formBuilder: FormBuilder,
    public formChecker: FormCheckerService

  ) {

  }


  async ngOnInit() {
    // let _pseudo = this.route.snapshot.paramMap.get('pseudo')!;
    // this.pseudo = _pseudo ? _pseudo : '';
    await this.getMembre();

    this.initFormControls();
    this.initFormObservables();
  }

  /**
   * Initialisation des controls
   */
  private initFormControls(): void {
    // le formulaire pour le changement de mot de passe
    // le mot de passe actuel
    this.passwordCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), passwordValidator()]);
    // le nouveau mot de passe
    this.newPasswordCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), passwordValidator()]);
    // un champ pour confirmer le nouveau mot de passe
    this.confirmNewPasswordCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), passwordValidator()]);
    // le formulaire pour le changement de mot de passe 
    this.passwordForm = this.formBuilder.group({
      newPasswordCtrl: this.newPasswordCtrl,
      confirmNewPasswordCtrl: this.confirmNewPasswordCtrl
    }, {
      validators: [confirmEqualValidator('newPasswordCtrl', 'confirmNewPasswordCtrl')],//placement d'un validator qui verifie que le mot de passe a bien etait confirmer
      updateOn: 'blur' //les validators sont verifier lorsqu'on quitte l'input
    });

    // le formulaire pour le changement d'email
    // lemail actuel
    this.emailCtrl = this.formBuilder.control('', [Validators.required, Validators.email, Validators.maxLength(50)]);
    // le nouvel email
    this.newEmailCtrl = this.formBuilder.control('', [Validators.required, Validators.email, Validators.maxLength(50)]);
    // un champ de confirmation de lemail
    this.confirmNewEmailCtrl = this.formBuilder.control('', [Validators.required, Validators.email, Validators.maxLength(50)]);
    // le formulaire pour lemail
    this.emailForm = this.formBuilder.group({
      newEmailCtrl: this.newEmailCtrl,
      confirmNewEmailCtrl: this.confirmNewEmailCtrl
    }, {
      validators: [confirmEqualValidator('newEmailCtrl', 'confirmNewEmailCtrl')], //placement d'un validator qui verifie que lemail a bien etait confirmer
      updateOn: 'blur' //les validators sont verifier lorsqu'on quitte l'input
    });

    // Le formulaire principal
    this.mainForm = this.formBuilder.group({
      // ses attributs    
      password: this.passwordCtrl,
      newPassword: this.passwordForm,
      email: this.emailCtrl,
      newEmail: this.emailForm,
    });
  }

  /**
   * Reenitialise les messages d'erreur venant du serveur
   * @returns 
   */
  private initMessageServeur() {
    return { error: false, formulaire: "", message: "" };
  }

  /**
   * Executes les requetes suites a la validation d'un des formulaires
   * @param formData 
   */
  onSubmit(formData: FormData, formulaire : "mot de passe" | "email") {
    // execution de la requete
    // tester que fonctionne toujours apres la merge
    this.profileService.editProfile(formData).subscribe({
      next: (res: any) => {
        if (res.error) {
          this.showMessageServeur.message = res.messages[0].message; // reccupere le message d'erreur venant du serveur
          this.showMessageServeur.error=true;
        } else {
          this.showMessageServeur = this.initMessageServeur();
          this.showMessageServeur.message = `Votre ${formulaire} a bien été modifié.`
        }
        // reactivation des boutons 
        if(formulaire=="mot de passe"){
          // le bouton de mdp
          this.loadingPassword = false;
        }else{
          // le boutn d'email
          this.loadingEmail = false;
        }
      }
    })
  }

  /**
   * Si le fomrulaire d'email est soumis
   */
  emailSubmit() {
    // desactive les boutons pour l'empecher de relancer une requete
    this.loadingEmail = true;
    this.showMessageServeur.formulaire = "email";
    //prepare les données a envoyer
    const formData = new FormData();
    formData.append('email', this.emailCtrl.value);
    formData.append('newEmail', this.newEmailCtrl.value);
    this.onSubmit(formData, "email")
  }

  /**
   * Si le formulaire de mot de passe est soumis
   */
  passwordSubmit() {
    // desactive les boutons pour l'empecher de relancer une requete
    this.loadingPassword = true;
    this.showMessageServeur.formulaire = "password";
    //prepare les données a envoyer
    const formData = new FormData();
    formData.append('password', this.passwordCtrl.value);
    formData.append('newPassword', this.newPasswordCtrl.value);
    this.onSubmit(formData, "mot de passe")
  }

  /**
   * Initialise les observables du formulaire
   */
  private initFormObservables() {
    // les messages en rapport au email
    this.showEmailError$ = this.emailForm.statusChanges.pipe(
      map(status => status === 'INVALID' &&
        this.newEmailCtrl.value &&
        this.confirmNewEmailCtrl.value &&
        this.emailForm.hasError('confirmEqual')
      )
    );
    // les messages en rapport au mot de passe
    this.showPasswordError$ = this.passwordForm.statusChanges.pipe(
      map(status => status === 'INVALID' &&
        this.newPasswordCtrl.value &&
        this.confirmNewPasswordCtrl.value &&
        this.passwordForm.hasError('confirmEqual')
      )
    );
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
}
