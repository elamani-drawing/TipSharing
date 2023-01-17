import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  // FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';

/**
 * Les providers pour les connexions social
 */
class AuthSocialManagerProvider {

  constructor() { }
  
  getProviders() {
    // Les providers des reseaux social qu'on veut utiliser
    return {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        // pas d'auto connexion
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.GOOGLE_CLIENT_ID,
              {
                oneTapEnabled: false,//efface le bouton se connecter
                prompt: 'select_account',
              }
            )
          },
          // {
          //   id: FacebookLoginProvider.PROVIDER_ID,
          //   provider: new FacebookLoginProvider('clientId')
          // }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  }
}

/**
 * Une instance du provider AuthSocialManagerProvider
 */
export const authSocialManagerProvider = new AuthSocialManagerProvider();