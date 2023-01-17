import { animate, animation, style } from '@angular/animations';

/**
 * Realise une animation de glissement de gauche à droite avec un fondu 
 */
export const slideAndFadeAnimation = animation([
  style({
    transform: 'translateX(-100%)',
    opacity: 0,
    'background-color': '{{ startColor }}',
  }),
  animate('{{ time }} ease-out', style({
    transform: 'translateX(0)',
    opacity: 1,
    'background-color': 'white',
  })),
]);