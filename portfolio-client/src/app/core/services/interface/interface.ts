import { Injectable, signal, WritableSignal, computed, type Signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { FancyUIElementTypeType } from '@ervum/types';

import { Translations, type TranslationDictionary } from '../../internationalization';



@Injectable({
  providedIn: 'root'
})
export class InterfaceService {
  private readonly IsBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) PlatformID: object) {
    this.IsBrowser = isPlatformBrowser(PlatformID);
  }

  /** The global interface type (Primary / Secondary) */
  public InterfaceType: WritableSignal<FancyUIElementTypeType> = signal<FancyUIElementTypeType>('Primary');

  /** The global interface language */
  public Language: WritableSignal<string> = signal<string>('English');

  /** Whether the typewriter animation is enabled */
  public Typewriter: WritableSignal<boolean> = signal<boolean>(true);

  /** The duration (in ms) for the global interface theme transition */
  public ThemeTransitionDuration: WritableSignal<number> = signal<number>(3000);

  /** Active translation dictionary */
  public readonly T: Signal<TranslationDictionary> = computed(() => (Translations[this.Language()] || Translations['English']));

  /**
   * Toggles the global interface type between Primary and Secondary.
   */
  public ToggleInterfaceType(): void {
    this.InterfaceType.update(CurrentType => (CurrentType === 'Primary') ? 'Secondary' : 'Primary');
  }

  /**
   * Toggles the theme with a circular View Transition ripple expanding from the given coordinates.
   * Falls back to an instant toggle if the View Transitions API is unavailable.
   */
  public ToggleInterfaceTypeWithTransition(X: number, Y: number): void {
    if (!(this.IsBrowser) || !(document.startViewTransition)) {
      this.ToggleInterfaceType();

      return;
    }

    const EndRadius: number = Math.hypot(
      Math.max(X, ((window.innerWidth) - X)),
      Math.max(Y, ((window.innerHeight) - Y))
    );

    const Transition = document.startViewTransition(() => {
      this.ToggleInterfaceType();
    });

    Transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${X}px ${Y}px)`,
            `circle(${EndRadius}px at ${X}px ${Y}px)`
          ]
        },
        {
          duration: this.ThemeTransitionDuration(),
          easing: 'cubic-bezier(0.86, 0, 0.07, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    });
  }

  /**
   * Sets the global interface type.
   */
  public SetInterfaceType(Type: FancyUIElementTypeType): void {
    this.InterfaceType.set(Type);
  }

  /**
   * Sets the global interface language.
   */
  public SetLanguage(Language: string): void {
    this.Language.set(Language);
  }

  /**
   * Sets the theme transition duration.
   */
  public SetThemeTransitionDuration(Duration: number): void {
    this.ThemeTransitionDuration.set(Duration);
  }
}
