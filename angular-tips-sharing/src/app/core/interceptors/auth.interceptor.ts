import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  refresh = false;
  login = 'login';

  constructor(private authService: AuthService) { }

  /**
   * Ajouter le jwtToken dans le header de la requete
   * @param jwtToken le jwt token
   * @param req la requete
   * @returns 
   */
  private BearerAuthorization(jwtToken: string | null, req: HttpRequest<any>) {
    // si on a un token, on met à jour la Bearer authorization
    if (!!jwtToken) {
      // si on a un token, on l'ajoute dans la requet
      const headers = new HttpHeaders()
        .append('Authorization', `Bearer ${jwtToken}`);
      req = req.clone({ headers });// clone
    }
    return req;
  }

  /**
   * Intercepte toutes les requetes http de lapplication
   * @param request 
   * @param next 
   * @returns 
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // interception de toute les requettes http pour y introduire le jwt 
    // le token est soit reccuperer suite à un login, soit reccuperer dans les coockies 
    const jwtToken = this.authService.getJwtToken();
    let req = this.BearerAuthorization(jwtToken, request); // aliases de req
    // req est soit un aliases de request soit un clone
    // execution de la requete
    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
      //s'il y a une erreur 401 Unauthorized et qu'on a pas encore essayer de rafre
      if (err.status === 401) {
        //tentative de refresh le token
        return this.authService.http.get(`${environment.apiUrl}/refresh-token`, {}).pipe(
          switchMap((res: any) => {
            // si la refresh n'a pas fonctionner, c'est que le token est expirer depuis trop longtemps ou est invalide
            if (res && res.error) {
              // this.refresh = false;
              return throwError(() => {
                // on lance une deconnexion 
                this.authService.logout();
              });
            }
            // on a un succes
            // met à jour le token du service
            this.authService.setJwtToken(res.payload.token);
            // met à jour les coockies de l'application
            this.authService.coockiestorage.setJwtToken(res.payload.token);
            // met à jour les informations auth du local storage
            this.authService.localstorage.setAuthData({ 'xsrfToken': res.payload.xsrf, 'isAdmin': res.payload.isAdmin });
            // actualise les données du Service
            this.authService.actualiseAuthService(); 
            return next.handle(
              this.BearerAuthorization(this.authService.getJwtToken(), req) // une seconde tentative avec le nouveau token
            );
          })
        );
      } else if (err.status === 404) {
        console.log("---Erreur 404 vers le serveur, verifiez le type de requete et le lien");
      }
      // une erreur est survenu, on deconnecte le client
      return throwError(() => {
        // on lance une deconnexion 
        this.authService.logout();
      });
    }));
  }
}
