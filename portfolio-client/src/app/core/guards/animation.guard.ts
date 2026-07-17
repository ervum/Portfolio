import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { InterfaceService } from '../services/interface/interface';



/**
 * Global guard that ensures exit animations play before a route change.
 * - For manual navigations (NavigateWithAnimation): allows immediately (animation already handled).
 * - For browser back/forward: triggers exit animation and delays the navigation by 800ms.
 */
export const AnimationGuard: CanDeactivateFn<unknown> = () => {
  const Service: InterfaceService = inject(InterfaceService);

  // If this was triggered by NavigateWithAnimation, exit animation already played — allow immediately
  if (Service.IsManualNavigation) {
    return true;
  }

  // Browser back/forward or other external navigation — trigger exit animation and delay
  Service.RouteTransitionRequest.set('__browser_navigation__');

  return new Promise<boolean>((Resolve: (Value: boolean) => void) => {
    setTimeout(() => {
      Service.RouteTransitionRequest.set(null);

      Resolve(true);
    }, 800);
  });
};
