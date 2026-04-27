import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InterfaceService } from '../interface/interface';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private Router: Router = inject(Router);
  private InterfaceService: InterfaceService = inject(InterfaceService);

  /**
   * Navigates to the target route after triggering an exit animation.
   * @param Target The target route (e.g., 'home', 'authentication/recovery').
   */
  public NavigateWithAnimation(Target: string): void {
    const CurrentPath = this.Router.url.split('?')[0];
    const NormalizedTarget = (Target.startsWith('/') ? Target.substring(1) : Target);
    const TargetPath = `/${NormalizedTarget}`;
    
    if (CurrentPath === TargetPath || (NormalizedTarget === 'home' && CurrentPath === '/')) return;

    // Mark as manual navigation so the guard allows it immediately
    this.InterfaceService.IsManualNavigation = true;

    // Trigger exit animation in the currently active component
    this.InterfaceService.RouteTransitionRequest.set(NormalizedTarget);

    // Wait for the exit animation to complete before performing the actual route change
    setTimeout(() => {
        // Reset the transition request BEFORE navigating so the new component doesn't trigger 'Out'
        this.InterfaceService.RouteTransitionRequest.set(null);

        this.Router.navigate([TargetPath]).then(() => {
            // Reset manual navigation flag only after navigation fully completes
            this.InterfaceService.IsManualNavigation = false;
        });
    }, 800);
  }
}
