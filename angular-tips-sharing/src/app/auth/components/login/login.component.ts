import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from 'src/app/core/services/auth.service';
import { FormCheckerService } from 'src/app/shared/services/form-checker.service';
import { LoginRegisterService } from '../../services/login-register.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private loginRegister: LoginRegisterService,
    private formBuilder: FormBuilder,
    public formChecker: FormCheckerService
  ) {}

  mainForm!: FormGroup;
  usernameCtrl!: FormControl;
  passwordCtrl!: FormControl;
  
  loading = false;

  // message d'erreur venant du serveur
  
  messageServeur!: any;
  ngOnInit(): void {
    this.initFormControls();
  }

  private initFormControls(): void {
    this.usernameCtrl = this.formBuilder.control('', [Validators.required]);
    this.passwordCtrl = this.formBuilder.control('', [Validators.required]);
    // le formulaire
    this.mainForm = this.formBuilder.group({
      username: this.usernameCtrl,
      password: this.passwordCtrl,
    });
  }

  onSubmitForm() {
    this.loading = true; 
    const formData = new FormData();
    // remplissage du formData
    formData.append("username", this.mainForm.controls['username'].value);
    formData.append("password", this.mainForm.controls['password'].value);
    // requete de connexion
    this.loginRegister.login(formData).subscribe({
      next : (res : any) => {
        if (res.error) {
          //lecture des erreurs 
          if (res.messages && res.messages.length > 0 && res.messages[0]) {
            this.messageServeur = res.messages[0];
            this.loading = false; 
            return
          }
          // si on a pas de messages , c'est que le username ou le password est manquant, donc le serveur à juste renvoyer null
          this.messageServeur = { 'attribute': 'form', 'message': 'Veuillez correctement remplir le formulaire' };
          this.loading = false;
          return
        }
        // nous avons recu un token
        this.loginRegister.authService.setJwtToken(res.payload.token);
        // configuration des storages
        this.loginRegister.authService.localstorage.setAuthData({'xsrfToken' : res.payload.xsrf, 'isAdmin' : res.payload.isAdmin});
        this.loginRegister.authService.coockiestorage.setJwtToken(res.payload.token);
        this.loginRegister.authService.actualiseAuthService();
        //redirection sur la page de profil
        this.loginRegister.authService.redirect(this.loginRegister.authService.profilUrl);
      }, 
      error: (err) => {
        //si le serveur ou le programme a souleve une erreur
        this.messageServeur = { 'attribute': 'form', 'message': 'Une erreur est survenu, veuillez réessayer' };
        this.loading = false;
      }
    });
  }
}
