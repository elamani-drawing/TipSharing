import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, isFormRecord } from '@angular/forms';
const sizeO: number = 1; //1 octets
const sizeKO: number = 1024 * sizeO; // 1Ko
const sizeMO: number = 1024 * sizeKO; //1 Mo
const sizeGO: number = 1024 * sizeMO; // 1 GO
const sizeTO: number = 1024 * sizeGO; // 1 TO


export enum TypeOfFile {
  Picture,
}

export enum uniteOfFile {
  O,
  Ko,
  Mo,
  Go,
  To
}

/**
 * Prend une liste est format sont affichage
 * @param liste 
 * @param type 
 * @returns 
 */
export function formatArrayString(liste: string[], type: 'conjunction' | 'disjunction' | 'unit') {
  return new Intl.ListFormat('fr', { style: 'long', type: 'conjunction' }).format(liste)
}


/**
 * Convertit une valeur en Octets dans une autre unite
 * @param value en Octets
 * @param to un uniteOfFile
 * @returns un string indiquant la valeur convertit suivis de son unite
 */
function formatSize(value: number, to: uniteOfFile): string {
  if (to == uniteOfFile.O) {
    return value + 'O';
  } else if (to == uniteOfFile.Ko) {
    return (value / sizeKO) + 'Ko';
  } else if (to == uniteOfFile.Mo) {
    return (value / sizeMO) + 'Mo';
  } else if (to == uniteOfFile.Go) {
    return (value / sizeGO) + 'Go'
  }else {
    // To
    return (value / sizeTO) + 'To'
  }
}


@Injectable({
  providedIn: 'root'
})
export class FormCheckerService {

  constructor(
  ) { }

  /**
   * Indique si un input du formulaire est valid ou pas
   * @param ctrl 
   * @returns 
   */
  inputIsValid(ctrl: AbstractControl): boolean {
    return ctrl.invalid && (ctrl.dirty || ctrl.touched)
  }

  setValue(ctrl: AbstractControl, value:any) {
    ctrl.markAsTouched(); 
    ctrl.markAsDirty();
    ctrl.setValue(value);
  }


  /**
   * Retourne la class adéquate indiquant si un champ est correct ou non
   * @param ctrl 
   * @returns 
   */
  inputValideOrInvalid(ctrl: AbstractControl): string {
    if (ctrl.invalid && (ctrl.dirty || ctrl.touched)) {
      return 'is-invalid';
    } else if (ctrl.valid && (ctrl.dirty || ctrl.touched)) {
      return 'is-valid';
    } else {
      return '';
    }
  }

  /**
 * Handleur des messages d'erreur d'un formulaire
 * @param ctrl un abstract control
 * @param type le type de fichier (utile pour les inputs de type file)
 * @returns un message d'erreur
 */
  getFormControlErrorText(ctrl: AbstractControl, type?: TypeOfFile): string {
    if (ctrl.hasError('required')) {
      return 'Ce champ est obligatoire';
    } else if (ctrl.hasError('email')) {
      return 'Merci d\'entrer une adresse email valide';
    } else if (ctrl.hasError('maxlength')) {
      return `La valeur ne doit pas dépasser ${ctrl.getError('maxlength').requiredLength} carracteres`;
    } else if (ctrl.hasError('minlength')) {
      return `Vous devez saisir au moin ${ctrl.getError('minlength').requiredLength} carracteres`;
    } else if (ctrl.hasError('maxSizeFile')) {
      if (type == undefined) return `1 ou plusieurs fichiers possedent une extension qui n'est pas valide.`;
      return `1 ou plusieurs fichiers dépassent la taille maximal qui est de: ${formatSize(this.getSizeLimit(type), uniteOfFile.Mo)}`;
    } else if (ctrl.hasError('extensionFile')) {
      if (type == undefined) return `1 ou plusieurs fichiers possedent une extension qui n'est pas valide.`;
      return `1 ou plusieurs fichiers possedent une extension qui n'est pas valide. Voici la liste des extensions accepter: ${formatArrayString(this.getExtentionsFile(type), 'disjunction')}`;
    } else if (ctrl.hasError('passwordValidator')) {
      return `Le mot de passe doit être entre 8 et 15 caractères, avoir au moins une majuscule, une minuscule, un caractères special et un chiffre`
    } else if (ctrl.hasError('pseudoValidator')) {
      return `Le pseudo doit contenir 3 à 15 carracteres et ne peut etre composer que de lettre et de nombre`
    }else {
      return 'Ce champ contient une erreur';
    }
  }


  /**
   * Verifie si les fichiers données en parametre ont la bonne taille
   * @param typeFile 
   * @param files 
   * @returns une liste des fichiers qui pose probleme
   */
  checkSize(typeFile: TypeOfFile, files: File[]): File[] {
    const filesOverLimit: File[] = [];
    for (const file of files) {
      if (file.size > this.getSizeLimit(typeFile)) {
        filesOverLimit.push(file);
      }
    }
    return filesOverLimit;
  }

  /**
   * Verifie si les fichiers données en parametre ont la bonne extension
   * @param typeFile 
   * @param files 
   * @returns une liste des fichiers qui pose probleme
   */
  checkExtention(typeFile: TypeOfFile, files: File[]): File[] {
    //reccuperation des extentions
    const filesBadExtension: File[] = [];
    let extension: string = "";
    for (const file of files) {
      extension = "." + file.name.split('.').pop();
      if (!(this.getExtentionsFile(typeFile).includes(extension))) {
        filesBadExtension.push(file);
      }
    }
    return filesBadExtension;
  }


  /**
   * Indique la taille limite d'un type de fichier
   * @param type le type de fichier
   * @returns la taille limite
   */
  getSizeLimit(type: TypeOfFile): number {
    if (type == TypeOfFile.Picture) {
      return sizeMO * 5; //50 MO
    }
    //autre cas
    return sizeMO * 10; //valeur par defaut
  }

  /**
   * Donne une liste des extensions accepter pour un type de fichier
   * @param type le type de fichier
   * @returns une liste d'extension
   */
  getExtentionsFile(type: TypeOfFile): string[] {
    if (type == TypeOfFile.Picture) {
      return ['.jpg', '.jpeg', '.png', '.gif']; 
    }
    return ['.jpg', '.jpeg', '.png', '.gif'];
  }

  /**
   * Verifie qu'un fichier (ou un ensemble de fichier) qui provient d'un input est accepter
   * @param event l'evenement qui provient de l'input
   * @param type un TypeOfFile indiquant le type de fichier attendu
   * @returns true: si le ou les fichiers sont valides, sinon false
   */
  checkFileFormValidator(event: any, ctrl: FormControl, type: TypeOfFile): boolean {
    const files: File[] = event.target.files;
    // verifie la taille
    if (this.checkSize(type, files).length != 0) {
      ctrl.setErrors({ 'maxSizeFile': true });
    } else if (this.checkExtention(type, files).length != 0) {
      //l'extension
      ctrl.setErrors({ 'extensionFile': true });
    } else {
      return true;
    }
    // il y a eu une erreur
    return false;
  };

  /**
   * Remet à jour un formulaire ou un champ
   * @param form un FormControl ou un FormGroup
   */
  private resetForm(form: FormControl | FormGroup): void {
    form.reset();
  }


  tagsMinLength(tags: string[], length: number) {
    // tags est invalide
    return {
      valide: tags.length>=length,
      minLength: length,
      message: tags.length>=length ? '': `Vous devez saisir au minimum ${length} tags.`
    };
  }

  /**
   * Indique quel attribut d'un formGroupe ont été rempli
   * @param formulaire le formulaire à verifier
   * @returns une liste d'attribut
   */
  notEmptyAttributeForm(formulaire: FormGroup, requireValid?:boolean) {
    let attributes = []
    for (const [key, value] of Object.entries(formulaire.value)) {
        if(value!= '') {
          if(requireValid && formulaire.controls[key].valid==true){
            attributes.push(key);
          }
          if(!requireValid){         
            attributes.push(key);
          }
        }
    }
    return attributes;
  }

}