import {
  trigger,
  transition,
  style,
  animate,
  keyframes,
  group,
  query
} from '@angular/animations';

/**
 * ⚡ Base durations (central control)
 */
const FAST = '200ms ease-out';
const NORMAL = '300ms ease-in-out';
const SLOW = '400ms ease-in-out';

/**
 * 🔹 Fade
 */
export const fade = trigger('fade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(FAST, style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate(FAST, style({ opacity: 0 }))
  ])
]);

/**
 * 🔹 Scale (better than height animations)
 */
export const scale = trigger('scale', [
  transition(':enter', [
    style({ transform: 'scale(0.95)', opacity: 0 }),
    animate(NORMAL, style({ transform: 'scale(1)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate(FAST, style({ transform: 'scale(0.95)', opacity: 0 }))
  ])
]);

/**
 * 🔹 Slide Vertical (optimized - no height '*')
 */
export const slideY = trigger('slideY', [
  transition(':enter', [
    style({ transform: 'translateY(-10px)', opacity: 0 }),
    animate(NORMAL, style({ transform: 'translateY(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate(FAST, style({ transform: 'translateY(-10px)', opacity: 0 }))
  ])
]);

/**
 * 🔹 Slide Horizontal
 */
export const slideX = trigger('slideX', [
  transition(':enter', [
    style({ transform: 'translateX(-20px)', opacity: 0 }),
    animate(NORMAL, style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate(FAST, style({ transform: 'translateX(-20px)', opacity: 0 }))
  ])
]);

/**
 * 🔹 Bounce (cleaner)
 */
export const bounceIn = trigger('bounceIn', [
  transition(':enter', [
    animate(NORMAL, keyframes([
      style({ transform: 'translateY(-20px)', opacity: 0, offset: 0 }),
      style({ transform: 'translateY(10px)', opacity: 1, offset: 0.6 }),
      style({ transform: 'translateY(0)', offset: 1 })
    ]))
  ])
]);

/**
 * 🔹 Collapse (kept only if really needed)
 * ⚠️ Avoid heavy use
 */
export const collapse = trigger('collapse', [
  transition(':enter', [
    style({ height: 0, opacity: 0, overflow: 'hidden' }),
    animate(NORMAL, style({ height: '*', opacity: 1 }))
  ]),
  transition(':leave', [
    animate(FAST, style({ height: 0, opacity: 0 }))
  ])
]);

/**
 * 🔹 Route Animation (modern + smooth)
 */
export const routeFade = trigger('routeFade', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0
      })
    ], { optional: true }),

    group([
      query(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),

      query(':enter', [
        style({ opacity: 0, transform: 'translateY(6px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { optional: true })
    ])
  ])
]);

/**
 * 🔹 Masonry (list/grid animation)
 */
export const listItem = trigger('listItem', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate(FAST, style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);
