import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Tip } from 'src/app/tips/models/tip.model';
import { Commentaire } from 'src/app/tips/models/commentaire.model';
import { Router } from '@angular/router';
import { Tag } from 'src/app/tips/models/tag.model';
import { TipInfo } from 'src/app/tips/models/tip-info.model';

@Injectable({
  providedIn: 'root'
})
export class TipsService {

  constructor(private http: HttpClient, public router: Router) { }

  /**
   * Permet de creer un post en bdd
   * @param data 
   */
  createTip(data: FormData) {
    const url = `${environment.apiUrl}/tips`;
    return this.http.post(url, data)
      .pipe()
  }

  /**
   * Permet de reccuperer tout les tips valider qui sont dans la base de donéee
   * @returns 
   */
  getTips(): Tip[] {
    const url = `${environment.apiUrl}/tips`;
    let tips: Tip[] = [];
    this.http.get(url)
      .pipe()
      .subscribe({
        // le retour de la requete s'il ny a pas eu derreur serveur
        next: (res: any) => {
          let tips_object = res.payload.tips;
          if (!!tips_object == true) {
            // il y a au moin un tip en base de donnée
            for (const tip of tips_object) {
              tips.push({
                ...tip
              })
            }
          }
          return tips
        },
        // si le serveur a soulever une erreur
        error: (err) => {
          console.log("la requete de reccuperation des tips à echouer", err);
        }
      });
    return tips;
  }

  /**
   * Permet de reccuperer un tip grace à sn id
   * @param id l'id du tips
   * @returns Un tip
   */
  getTip(id: number): { tips: Tip[], tags: Tag[], tipInfo: TipInfo[] } {
    const url = `${environment.apiUrl}/tips/${id}`;
    let tips: Tip[] = [];
    let tags: Tag[] = [];
    let tipInfo: TipInfo[] = [];
    this.http.get(url)
      .pipe()
      .subscribe({
        // le retour de la requete s'il ny a pas eu derreur serveur
        next: (res: any) => {
          if (!!res.error == false && !!res.payload.tip == true) {
            // il y a au moin un tip en base de donnée
            tips.push(res.payload.tip);
            //sauvegarde des tags
            for (const tag of res.payload.tip.Tags) {
              tags.push({
                label: tag.label,
                id: tag.id
              })
            }
            tipInfo.push({
              Rarete: res.payload.tip.Rarete,
              Obtention: res.payload.tip.Obtention,
              Type: res.payload.tip.Type
            })
          } else {
            // il ny a pas de tips, redirection
            this.router.navigateByUrl('/tips');
          }
          return { tips, tags, tipInfo }
        },
        // si le serveur a soulever une erreur
        error: (err) => {
          console.log("la requete de reccuperation des tips à echouer", err);
        }
      }); return { tips, tags, tipInfo };
  }


  /**
   * Permet de reccuperer les tips de la personne connecter (meme les invalide)
   * @param id l'id du tips
   * @returns Un tip
   */
  getAllTipsOfMember(): Tip[] {
    const url = `${environment.apiUrl}/membre/tips/all`;
    let tips: Tip[] = [];
    this.http.get(url)
      .pipe()
      .subscribe({
        // le retour de la requete s'il ny a pas eu derreur serveur
        next: (res: any) => {
          let tips_object;
          if (res.succes) {
            tips_object = res.payload.tips;
            if (Array.isArray(tips_object)) {
              // il y a au moin 2 tip
              for (const tip of tips_object) {
                tips.push({
                  ...tip
                })
              }
            } else {
              // il y a qu'un seul tip
              tips.push({
                ...tips_object
              })
            }
          }
          return tips
        },
        // si le serveur a soulever une erreur
        error: (err) => {
          console.log("la requete de reccuperation des tips de l'utilisateur à echouer", err);
        }
      });
    return tips;
  }


  /**
   * Permet de reccuperer les tips valide d'un membre
   * @param pseudo l'utilisateur
   * @returns Un tip
   */
  getTipsOfMember(pseudo: string): Tip[] {
    const url = `${environment.apiUrl}/membre/tips/${pseudo}`;
    let tips: Tip[] = [];
    this.http.get(url)
      .pipe()
      .subscribe({
        // le retour de la requete s'il ny a pas eu derreur serveur
        next: (res: any) => {
          let tips_object;
          if (res.succes) {
            tips_object = res.payload.tips;
            if (Array.isArray(tips_object)) {
              // il y a au moin 2 tip
              for (const tip of tips_object) {
                tips.push({
                  ...tip
                })
              }
            } else {
              // il y a qu'un seul tip
              tips.push({
                ...tips_object
              })
            }
          }
          return tips
        },
        // si le serveur a soulever une erreur
        error: (err) => {
          console.log("la requete de reccuperation des tips de l'utilisateur à echouer", err);
        }
      });
    return tips;
  }

  /**
   * Permet de reccuperer les tips invalide du serveur
   */
  getTipsInvalide(): Tip[] {
    const url = `${environment.apiUrl}/admin/tips`;
    let tips: Tip[] = [];
    this.http.get(url)
      .pipe()
      .subscribe({
        // le retour de la requete s'il ny a pas eu derreur serveur
        next: (res: any) => {
          let tips_object;
          if (res.succes) {
            tips_object = res.payload.tips;
            if (Array.isArray(tips_object)) {
              // il y a au moin 2 tip
              for (const tip of tips_object) {
                tips.push({
                  ...tip
                })
              }
            } else {
              // il y a qu'un seul tip
              tips.push({
                ...tips_object
              })
            }
          }
          return tips
        },
        // si le serveur a soulever une erreur
        error: (err) => {
          console.log("la requete de reccuperation des tips invalide à echouer", err);
        }
      });
    return tips;
  }


  /**
   * Permet de reccuperer tout les commentaires d'un tips
   * @param id l'id du tips
   * @returns Une liste de commentaire
   */
  getCommentaires(id: number): Commentaire[] {
    const url = `${environment.apiUrl}/tips/${id}/commentaires`;
    let commentaires: Commentaire[] = [];
    this.http.get(url)
      .pipe()
      .subscribe({
        // le retour de la requete s'il ny a pas eu derreur serveur
        next: (res: any) => {
          let commentaire_object;
          if (res.succes && !!res.payload.commentaires == true) {
            commentaire_object = res.payload.commentaires;
            // il y a au moin un tip en base de donnée
            // si c'est une liste, on la parcour
            if (Array.isArray(commentaire_object)) {
              for (const commentaire of commentaire_object) {
                commentaires.push({
                  ...commentaire
                });
              }
            } else {
              commentaire_object = res.payload.commentaires;
              // sinon on reccupere lelement
              commentaires.push({
                ...commentaire_object
              })
            }
          }
          return commentaires
        },
        // si le serveur a soulever une erreur
        error: (err) => {
          console.log("la requete de reccuperation des commentaire de tips à echouer", err);
        }
      }); return commentaires;
  }

  /**
   * Supprime un commentaire du tip
   * @param commentaireId l'id du commentaire à supprimer
   */
  deleteCommentaire(commentaireId: number) {
    const url = `${environment.apiUrl}/tips/commentaires/${commentaireId}`;
    this.http.delete(url)
      .pipe()
      .subscribe()
  }

  /**
   * Poste un commentaire sur le tip
   * @param data les données du commentaire
   */
  postCommentaire(data: FormData) {
    const url = `${environment.apiUrl}/tips/commentaires`;
    return this.http.post(url, data)
      .pipe()
  }

  /**
   * Supprime un tip
   * @param id l'id du tip a supprimer
   * @returns 
   */
  deleteTip(id: number) {
    const url = `${environment.apiUrl}/tips/${id}`;
    return this.http.delete(url)
      .pipe()
      .subscribe({})
  }

  /**
   * Valide un tip
   * @param data l'id du tip a supprimer
   * @returns 
   */
  valideTip(data: FormData) {
    const url = `${environment.apiUrl}/admin/tips/valider`;
    return this.http.post(url, data)
      .pipe()
      .subscribe({})
  }

  /**
   * Enleve les elements ayant tipId de la liste de tip
   * @param tips la liste de tip
   * @param tipId  l'id d'un tip a enlever
   */
  removeTip(tips: Tip[], tipId: number) {
    let _tips = [];
    // recopie sans la liste sans le tip
    for (const _tip of tips) {
      if (_tip.id != tipId) {
        _tips.push(
          _tip
        )
      }
    }
    return _tips;
  }
  /**
   * Reccupere les differentes type de rarete de l'object
   * @returns 
   */
  getRaretes() {
    let raretes :any = [];
    const url = `${environment.apiUrl}/raretes`;
    this.http.get(url)
      .pipe()
      .subscribe({
        next: (res: any) => {
          // reccupere la liste des raretes du serveur 
          if (res.succes) {
            let _raretes = res.payload.raretes;
            if (Array.isArray(_raretes)) {
              for (const _rarete of _raretes) {
                raretes.push({
                  label: _rarete.label,
                  id: _rarete.id
                })
              }
            } else {
              raretes.push({
                label: _raretes.label,
                id: _raretes.id
              })
            }
            return raretes;
          }
        }
      })
      return raretes;
  }


  /**
   * Reccupere la liste des maniere d'obtenir un object
   * @returns 
   */
  getObtention() {
    let obtentions: any = [];
    const url = `${environment.apiUrl}/obtentions`;
    this.http.get(url)
      .pipe()
      .subscribe({
        next: (res: any) => {
          // reccupere la liste des raretes du serveur 
          if (res.succes) {
            let _obtentions = res.payload.obtentions;
            if (Array.isArray(_obtentions)) {
              for (const _obtention of _obtentions) {
                obtentions.push({
                  label: _obtention.label,
                  id: _obtention.id
                })
              }
            } else {
              obtentions.push({
                label: _obtentions.label,
                id: _obtentions.id
              })
            }
            return obtentions
          }
        }
      })
      return obtentions;
  }


  /**
   * Reccupere la liste des type d'objets
   * @returns 
   */
  getTypes() {
    let types: any = [];
    const url = `${environment.apiUrl}/types`;
    this.http.get(url)
      .pipe()
      .subscribe({
        next: (res: any) => {
          // reccupere la liste des raretes du serveur 
          if (res.succes) {
            let _types = res.payload.types;
            if (Array.isArray(_types)) {
              for (const _type of _types) {
                types.push({
                  label: _type.label,
                  id: _type.id
                })
              }
            } else {
              types.push({
                label: _types.label,
                id: _types.id
              })
            }
            return types
          }
        }
      })
      return types;
  }


}
