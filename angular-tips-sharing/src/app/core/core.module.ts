import { LOCALE_ID, NgModule } from '@angular/core';
import * as fr from '@angular/common/locales/fr';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpInterceptorProviders } from './interceptors';
// import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from './services/local-storage.service';
import { CoockieStorageService } from './services/coockie-storage.service';


/**
 * Ce module réeunni tous ce dont a besoin de base l'application pour fonctionner ainsi que les services qui doivent etre charger qu'une seule fois dans l'application
 */
@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  exports: [
    HeaderComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    httpInterceptorProviders,
    CoockieStorageService, 
    LocalStorageService
  ]
})
export class CoreModule {
  constructor() {
    registerLocaleData(fr.default);
  }
 }

