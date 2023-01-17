import { animate, animation, sequence, style } from '@angular/animations';

/**
 * Realise une animation de flash
 */
export const flashAnimation = animation([
  sequence([
    animate('{{ time }}', style({
      'background-color': '{{ flashColor }}'
    })),
    animate('{{ time }}', style({
      'background-color': 'white'
    })),
  ]),
])