import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { register as registerSwiperElements } from 'swiper/element/bundle';

// Save original method
// const originalAddEventListener = EventTarget.prototype.addEventListener;

// // Override
// EventTarget.prototype.addEventListener = function (
//   type: string,
//   listener: EventListenerOrEventListenerObject,
//   options?: boolean | AddEventListenerOptions
// ) {
//   // Force passive: false for specific events
//   const needsPassiveFalse = ['touchstart', 'touchmove', 'wheel'].includes(type);

//   if (needsPassiveFalse) {
//     if (typeof options === 'boolean' || options === undefined) {
//       options = { passive: false };
//     } else if (typeof options === 'object') {
//       options.passive = false;
//     }
//   }

//   return originalAddEventListener.call(this, type, listener, options);
// };

registerSwiperElements();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
