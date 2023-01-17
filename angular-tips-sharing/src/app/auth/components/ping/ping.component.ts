import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginRegisterService } from '../../services/login-register.service';

/**
 * Sert juste à réaliser un ping sur le serveur
 */
@Component({
  selector: 'app-ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.css']
})
export class PingComponent implements OnInit {
  
  mainForm!: FormGroup;
  constructor(
    private loginRegister: LoginRegisterService,
    private formBuilder: FormBuilder
    ) 
  {}

  ngOnInit(): void {
    // rien 
    this.mainForm = this.formBuilder.group({});
  }

  ping()  {
    console.log("---ping");
    this.loginRegister.ping();
    console.log("---fin du ping");
  }

}