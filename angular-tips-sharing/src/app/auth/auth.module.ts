import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './components/register/register.component';
import { LogoutComponent } from './components/logout/logout.component';
import { PingComponent } from './components/ping/ping.component';
import { authSocialManagerProvider } from './providers/auth-social-manager';
import { SocialLoginModule } from '@abacritt/angularx-social-login';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    PingComponent,
    
  ],
  imports: [
    CommonModule,
    AuthRoutingModule, 
    SharedModule,
    SocialLoginModule
  ], 
  exports : [
    LoginComponent, 
    RegisterComponent
  ],
  providers : [
    authSocialManagerProvider.getProviders()
  ]
})
export class AuthModule { }
