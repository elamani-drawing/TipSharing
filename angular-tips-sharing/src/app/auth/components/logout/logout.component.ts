import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent  implements OnInit {

  constructor(authService : AuthService) {
    // appelle de la fonction de deconnexion 
    authService.logout();
    return
  }

  ngOnInit(): void {
    // rien 
  } 
  // rien 
}
