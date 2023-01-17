import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

import { FormCheckerService, TypeOfFile } from 'src/app/shared/services/form-checker.service';
import { LoginRegisterService } from '../../services/login-register.service';

import { confirmEqualValidator } from '../../validators/confirm-equal.validator';
import { passwordValidator } from '../../validators/password.validator';
import { pseudoValidator } from '../../validators/pseudo.validator';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(
    private loginRegister: LoginRegisterService,
    private formBuilder: FormBuilder,
    public formChecker: FormCheckerService,
    private socialAuthService: SocialAuthService
  ) { }


  // les données suite à la connexion avec google
  user!: SocialUser;

  //formGroup principal
  mainForm!: FormGroup;

  //formGroup ayant les informations de profil de l'utilisateur
  pseudoCtrl!: FormControl;
  pictureCtrl!: FormControl;
  profilInfoForm!: FormGroup;

  pictureTypeFile: TypeOfFile = TypeOfFile.Picture;
  pictureValue!: File; // variable qui contient la valeur du fichier contenu dans le input file

  // formGroup des email 
  emailCtrl!: FormControl;
  confirmEmailCtrl!: FormControl;
  emailForm!: FormGroup;

  //formGroup des mots de passe
  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;
  passwordForm!: FormGroup;

  // messages d'erreur afficher dans le formulaire
  showEmailError$!: Observable<boolean>;
  showPasswordError$!: Observable<boolean>;
  messageServeur!: any;

  loading = false;

  ngOnInit(): void {
    // initialise les formControl
    this.initFormControls();
    // initialise le formulaire principale
    this.initMainForm();
    // initialise les observables
    this.initFormObservables();
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      // nous passant les informations gmail
      this.formChecker.setValue(this.emailCtrl, user.email);
      this.formChecker.setValue(this.confirmEmailCtrl, user.email);
      this.formChecker.setValue(this.profilInfoForm.controls['firstName'], user.firstName);
      this.formChecker.setValue(this.profilInfoForm.controls['lastName'], user.lastName);
    });
  }

  /**
   * Initialise le formGroupe principal
   */
  private initMainForm(): void {
    this.mainForm = this.formBuilder.group({
      personalInfo: this.profilInfoForm,
      email: this.emailForm,
      password: this.passwordForm
    });
  }

  /**
   * Initialise tous les formControl du formulaire et pose les validators adéquat
   */
  private initFormControls(): void {
    //initialisation des formControl et placement de validator generaux
    this.pseudoCtrl = this.formBuilder.control('', [pseudoValidator()]);
    this.pictureCtrl = this.formBuilder.control('');

    this.profilInfoForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.maxLength(20)]],
      pseudo: this.pseudoCtrl,
      picture: this.pictureCtrl,
    });

    this.emailCtrl = this.formBuilder.control('');
    this.confirmEmailCtrl = this.formBuilder.control('');
    this.emailForm = this.formBuilder.group({
      email: this.emailCtrl,
      confirmEmail: this.confirmEmailCtrl
    }, {
      validators: [confirmEqualValidator('email', 'confirmEmail')],
      updateOn: 'blur'
    });

    this.passwordCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), passwordValidator()]);
    this.confirmPasswordCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), passwordValidator()]);
    this.passwordForm = this.formBuilder.group({
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    }, {
      validators: [confirmEqualValidator('password', 'confirmPassword')],
      updateOn: 'blur' //les validators sont verifier lorsqu'on quitte l'input
    });

    //pause des validators restant
    this.setEmailValidators();
    this.setProfilValidators();
  }

  /**
   * Initialise les observables du formulaire
   */
  private initFormObservables() {

    this.showEmailError$ = this.emailForm.statusChanges.pipe(
      map(status => status === "INVALID" &&
        this.emailCtrl.value
        && this.emailCtrl.valid
        && this.confirmEmailCtrl.value
        && this.confirmEmailCtrl.valid
        && this.emailForm.hasError('confirmEqual')
      )
    );

    this.showPasswordError$ = this.passwordForm.statusChanges.pipe(
      map(status => status === 'INVALID' &&
        this.passwordCtrl.value &&
        this.confirmPasswordCtrl.value &&
        this.passwordForm.hasError('confirmEqual')
      )
    );
  }

  /**
   * Pose les validators sur emailCtrl et confirEmailCtrol
   */
  private setEmailValidators(): void {
    this.emailCtrl.addValidators([
      Validators.required,
      Validators.email,
      Validators.maxLength(50)
    ]);
    this.confirmEmailCtrl.addValidators([
      Validators.required,
      Validators.email,
      Validators.maxLength(50)
    ]);
    //mise à jour 
    this.emailCtrl.updateValueAndValidity();
    this.confirmEmailCtrl.updateValueAndValidity();
  }

  private setProfilValidators(): void {
    this.pseudoCtrl.addValidators([
      Validators.required,
      Validators.maxLength(15),
    ]);
    this.pictureCtrl.addValidators([
      Validators.required,
    ]);
    //mise à jour 
    this.pseudoCtrl.updateValueAndValidity();
    this.pictureCtrl.updateValueAndValidity();
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
   * Function qui est appeller à la soumission du formulaire
   * @returns 
   */
  onSubmitForm() {
    this.loading = true;
    //s'il a pus valider le formulaire c'est qu'il a passer un fichier valide donc on peut faire appel a this.pictureValue
    const formData = new FormData();
    // on verifie qu'un fichier est envoyer au serveur
    if (undefined == this.pictureValue) {
      this.pictureCtrl.setErrors({ 'extensionFile': true })
      return
    }
    //preparation des données à envoyer
    formData.append("picture", this.pictureValue, this.pictureValue.name);
    formData.append("lastName", this.profilInfoForm.controls['lastName'].value);
    formData.append("firstName", this.profilInfoForm.controls['firstName'].value);
    formData.append("pseudo", this.profilInfoForm.controls['pseudo'].value);
    formData.append("email", this.emailForm.controls['email'].value);
    formData.append("password", this.passwordForm.controls['password'].value);
    //tentative d'envoie du formulaire
    this.loginRegister.register(formData).subscribe({
      next: (res: any) => {
        //si on recoit une reponse, mais qu'il y a une erreur
        if (res.error) {
          //lecture des erreurs 
          if (res.messages && res.messages.length > 0 && res.messages[0]) {
            this.messageServeur = res.messages[0];
            this.loading = false;
            return
          }
          // si on a pas de messages , c'est que le pseudo ou le password est manquant, donc le serveur à juste renvoyer null
          this.messageServeur = { 'attribute': 'form', 'message': 'Veuillez correctement remplir le formulaire' };
          this.loading = false;
          return
        }
        //si on est arriver ici c'est quon a pas eu derreur est qu'appriori l'inscription a fonctionner
        // redirection vers la page de connexion
        this.loading = false;
        this.loginRegister.authService.redirect(this.loginRegister.authService.loginUrl);
      },
      error: (err) => {
        //si le serveur ou le programme a souleve une erreur
        this.messageServeur = { 'attribute': 'form', 'message': 'Une erreur est survenu, veuillez réessayer' };
        this.loading = false;
      }
    });
    ;
  }

}
