import { Directive, ElementRef, OnInit, inject, effect, OnDestroy } from '@angular/core';
import { AnimationBuilder, style, animate, AnimationFactory, AnimationPlayer } from '@angular/animations';
import { Nullable } from '@ervum/types';
import { InterfaceService } from '../../../core/services/interface/interface';

@Directive({
  selector: '[FancySlideUpDown]',
  standalone: true
})
export class SlideUpDownDirective implements OnInit, OnDestroy {
  private readonly ElementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly Builder: AnimationBuilder = inject(AnimationBuilder);
  private readonly InterfaceService: InterfaceService = inject(InterfaceService);

  private HasPlayedOut: boolean = false;

  constructor() {
    // Listen for exit requests (manual or guard-triggered)
    effect(() => {
      const Request: Nullable<string> = this.InterfaceService.RouteTransitionRequest();
      if (Request !== null) {
        this.HasPlayedOut = true;
        this.PlayAnimation('Out');
      } else if (this.HasPlayedOut && Request === null) {
        this.HasPlayedOut = false;
        this.PlayAnimation('In');
      }
    });
  }

  public ngOnInit(): void {
    if (!this.InterfaceService.IsAppInitialized) {
      // First page load or refresh — show instantly, no animation
      this.InterfaceService.IsAppInitialized = true;
      this.ElementRef.nativeElement.style.transform = 'translateY(0)';
      this.ElementRef.nativeElement.style.opacity = '1';
    } else {
      // SPA navigation (in-page, browser arrows, etc.) — play entrance animation
      this.PlayAnimation('In');
    }
  }

  public ngOnDestroy(): void {
  }

  /**
   * Plays the slide animation.
   * @param State The animation state ('In' or 'Out').
   */
  private PlayAnimation(State: 'In' | 'Out'): void {
    const Animation: AnimationFactory = this.Builder.build([
      style(State === 'In' ? { transform: 'translateY(100vh)', opacity: 0 } : { transform: 'translateY(0)', opacity: 1 }),
      animate('0.8s cubic-bezier(0.86, 0, 0.07, 1)', style(State === 'In' ? { transform: 'translateY(0)', opacity: 1 } : { transform: 'translateY(100vh)', opacity: 0 }))
    ]);

    const Player: AnimationPlayer = Animation.create(this.ElementRef.nativeElement);
    Player.play();
  }
}
