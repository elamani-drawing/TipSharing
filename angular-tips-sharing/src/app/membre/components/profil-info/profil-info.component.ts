import { Component, Input, OnInit } from '@angular/core';
import { Membre } from 'src/app/shared/models/membre.model';

@Component({
  selector: 'app-profil-info',
  templateUrl: './profil-info.component.html',
  styleUrls: ['./profil-info.component.css']
})
export class ProfilInfoComponent implements OnInit {

  @Input() membre!: Membre; 
  
  constructor() { }

  ngOnInit(): void {
     
  }
}