import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AdminModule } from './admin/admin.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { MembreModule } from './membre/membre.module';
import { SharedModule } from './shared/shared.module';
import { TipsModule } from './tips/tips.module';
import { AccueilComponent } from './accueil/accueil.component';


@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    AuthModule,
    AdminModule,
    MembreModule, 
    TipsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
