import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipsRoutingModule } from './tips-routing.module';
import { TipsListComponent } from './components/tips-list/tips-list.component';
import { NewTipsComponent } from './components/new-tips/new-tips.component';
import { TipComponent } from './components/tip/tip.component';
import { SingleTipsComponent } from './components/single-tips/single-tips.component';
import { TagInputComponent } from './components/tag-input/tag-input.component';
import { SharedModule } from '../shared/shared.module';
import { TipsListPageComponent } from './components/tips-list-page/tips-list-page.component';
import { CommentaireTipsComponent } from './components/commentaire-tips/commentaire-tips.component';
import { TagListComponent } from './components/tag-list/tag-list.component';
import { TipSupValComponent } from './components/tip-sup-val/tip-sup-val.component';


@NgModule({
  declarations: [
    TipsListComponent,
    NewTipsComponent,
    TipComponent,
    SingleTipsComponent,
    TagInputComponent,
    TipsListPageComponent,
    CommentaireTipsComponent,
    TagListComponent,
    TipSupValComponent
  ],
  imports: [
    CommonModule,
    TipsRoutingModule,
    SharedModule
  ], 
  exports : [
    TipsListComponent, 
    NewTipsComponent, 
    SingleTipsComponent,
    TipSupValComponent
  ]
})
export class TipsModule { }
