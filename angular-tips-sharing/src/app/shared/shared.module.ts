import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ShortenPipe } from './pipes/shorten.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { FormCheckerService } from './services/form-checker.service';
import { LinkToolsService } from './services/link-tools.service';

/**
 * Ce module réeuni tous les modules, directive, services etc. que requiert tous les modules de l'applications
 */
@NgModule({
  declarations: [
    ShortenPipe,
    TimeAgoPipe,
    HighlightDirective,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ReactiveFormsModule, 
    ShortenPipe,
    TimeAgoPipe,
    HighlightDirective
  ],
  providers: [
    FormCheckerService,
    LinkToolsService
  ]
})
export class SharedModule { }
