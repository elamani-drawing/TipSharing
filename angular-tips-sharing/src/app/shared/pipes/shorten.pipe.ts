import { Pipe, PipeTransform } from '@angular/core';

/**
 * Réduis un texte et ajoute 3 petits points
 */
@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
    transform(value: string, maxLength = 50): string {
        if (value.length <= maxLength) {
            return value;
        }
        return value.substring(0, maxLength) + '…';
    }
}