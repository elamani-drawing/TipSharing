import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormCheckerService } from 'src/app/shared/services/form-checker.service';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.css']
})
export class TagInputComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    public formChecker: FormCheckerService
  ) { }
  // une liste des tags
  tagStore: string[] = [];
  tagMaxLength = 20;
  // un emetteur qui servira à envoyer les données tagStore au component parent avant l'envoie d'un formulaire
  @Output() tagEmitter = new EventEmitter<string[]>();

  tagsForm!: FormGroup;
  tagsInputCtrl!: FormControl;

  ngOnInit(): void {
    this.initFormControls();
    
  }

  private initFormControls(): void {
    // placement des validateurs
    this.tagsInputCtrl = this.formBuilder.control('', [Validators.minLength(3), Validators.maxLength(this.tagMaxLength)]);
    // le formulaire
    this.tagsForm = this.formBuilder.group({
      tags: this.tagsInputCtrl,
    });
  }

  /**
   * Supprime un tag de la liste des tags
   */
  deleteTag(tag: string) {
    // recopie la liste d'origine sans les elements indesirables
    this.tagStore = this.tagStore.filter(function(item) {
      return item !== tag;
    })
    this.emitTags();
  }

  /**
   * Ajoute un tag dans la liste des tags
   */
  addTag(tag: string) {
    // si le tag na pas encore etait ajouter, on l'ajoute
    if (!this.tagStore.includes(tag)) {
      if(tag.length > this.tagMaxLength){
        // on ignore le tag (ce n'est jamais censer arriver)
        return 
      }
      this.tagStore.push(tag);
      // emissions vers le components parents
      this.emitTags();
    }
    // si rien a etait changer, c'est pas la peine d'emettre
    // réenitialisation de la valeur de l'input
    this.tagsInputCtrl.setValue('');
  }

  /**
   * Envoie le tagStore au composant parent
   */
  emitTags() {
    this.tagEmitter.emit(this.tagStore);
  }
}
