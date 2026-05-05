import { REQUEST, Injectable, signal, WritableSignal, computed, PLATFORM_ID, effect, inject, TransferState, makeStateKey, type Signal, StateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Nullable, FancyUIElementTypeType, FancyUIElementLoadStatusType } from '@ervum/types';

import { Translations, type TranslationDictionary } from '../../internationalization';



@Injectable({
  providedIn: 'root'
})
export class InterfaceService {
  private readonly PlatformID: object = inject(PLATFORM_ID);
  private readonly Request: any = inject(REQUEST, { optional: true });
  private readonly IsBrowser: boolean = isPlatformBrowser(this.PlatformID);
  private readonly TransferState: TransferState = inject(TransferState);

  private readonly LanguageKey = makeStateKey<string>('Interface-Language');
  private readonly ThemeKey = makeStateKey<string>('Interface-Theme');

  /** Active translation dictionary */
  public readonly T: Signal<TranslationDictionary> = computed(() => (Translations[this.Language()] || Translations['English']));

  /** Whether the typewriter animation is enabled */
  public Typewriter: WritableSignal<boolean> = signal<boolean>(true);

  /** The duration (in ms) for the global interface theme transition */
  public ThemeTransitionDuration: WritableSignal<number> = signal<number>(3000);

  /** Signal used to trigger exit animations in the active component before route changes */
  public RouteTransitionRequest: WritableSignal<Nullable<string>> = signal<Nullable<string>>(null);

  /** The global interface load status (Idle / Loading / Success / Error) */
  public Status: WritableSignal<FancyUIElementLoadStatusType> = signal<FancyUIElementLoadStatusType>('Idle');

  /** Whether the app has completed its initial page load (used to skip animation on first render / refresh) */
  public IsAppInitialized: boolean = false;

  /** Whether a manual navigation (NavigateWithAnimation) is in progress (exit animation already handled) */
  public IsManualNavigation: boolean = false;

  /** Shared data passed between routes during navigation */
  private NavigationData: WritableSignal<any> = signal<any>(null);

   /** Helper to get initial value from Cookie/localStorage safely */
  private GetInitialValue(Key: string, DefaultValue: string): string {
    // Check TransferState first (client-side hydration)
    const StateKey: StateKey<string> = Key === 'Interface-Language' ? this.LanguageKey : this.ThemeKey;
    const TransferredValue: Nullable<string> = this.TransferState.get(StateKey, null);

    const CookieValue: Nullable<string> = this.GetCookie(Key);

    if (TransferredValue) {
        return TransferredValue;
    }

    if (CookieValue) {
        if (!this.IsBrowser) {
            this.TransferState.set(StateKey, CookieValue);
        }

        return CookieValue;
    }

    if (this.IsBrowser) {
        const LocalValue: Nullable<string> = localStorage.getItem(Key);

        if (LocalValue) { return LocalValue; }
    }

    return DefaultValue;
  }

  /** Helper to read a cookie (browser or server) */
  private GetCookie(Name: string): Nullable<string> {
    let CookieString: string = '';
    
    if (this.IsBrowser) {
      CookieString = document.cookie;
    } else if (this.Request) {
      // Robust detection for different request types in SSR
      try {
        if (this.Request.headers && typeof this.Request.headers.get === 'function') {
          CookieString = this.Request.headers.get('cookie') || '';
        } else if (this.Request.headers && (this.Request.headers as any)['cookie']) {
          CookieString = (this.Request.headers as any)['cookie'];
        } else if (typeof (this.Request as any).get === 'function') {
          CookieString = (this.Request as any).get('cookie') || '';
        }
      } catch (Error) {
        console.error('Error reading cookie header on server:', Error);
      }
    }

    if (!CookieString) return null;

    const NameLenPlus: number = (Name.length + 1);
    const Parts: string[] = CookieString.split(';');
    
    for (let Part of Parts) {
      Part = Part.trim();

      if (Part.substring(0, NameLenPlus) === `${Name}=`) {
        return decodeURIComponent(Part.substring(NameLenPlus));
      }
    }

    return null;
  }

  /** Helper to set a cookie (browser only) */
  private SetCookie(Name: string, Value: string): void {
    if (this.IsBrowser) {
      document.cookie = `${Name}=${Value}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }

  /** The global interface type (Primary / Secondary) */
  public InterfaceType: WritableSignal<FancyUIElementTypeType> = signal<FancyUIElementTypeType>(
    this.GetInitialValue('Interface-Theme', 'Primary') as FancyUIElementTypeType
  );

  /** The global interface language */
  public Language: WritableSignal<string> = signal<string>(
    this.GetInitialValue('Interface-Language', 'English')
  );

  constructor() {
    if (this.IsBrowser) {
      // Persistence effects
      effect(() => {
        const Theme: FancyUIElementTypeType = this.InterfaceType();
        localStorage.setItem('Interface-Theme', Theme);
        this.SetCookie('Interface-Theme', Theme);
      });
      effect(() => {
        const Language: string = this.Language();
        localStorage.setItem('Interface-Language', Language);
        this.SetCookie('Interface-Language', Language);
        
        document.documentElement.lang = this.T().LanguageCode;
      });

      effect(() => {
        const Type: FancyUIElementTypeType = this.InterfaceType();

        document.documentElement.classList.remove('Theme--Primary', 'Theme--Secondary');
        document.documentElement.classList.add(`Theme--${Type}`);
      });
    }
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

    const Transition: any = (document as any).startViewTransition(() => {
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
   * Toggles the global interface type between Primary and Secondary.
   */
  public ToggleInterfaceType(): void {
    this.InterfaceType.update(CurrentType => (CurrentType === 'Primary') ? 'Secondary' : 'Primary');
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
   * Sets the global interface load status with an optional timeout to reset to Idle.
   */
  public SetStatus(Status: FancyUIElementLoadStatusType, Timeout: number = 3000): void {
    this.Status.set(Status);

    if (Status !== 'Idle' && Status !== 'Loading') {
      setTimeout(() => this.Status.set('Idle'), Timeout);
    }
  }

  /**
   * Helper to get status-based classes for the main containers.
   */
  public GetStatusClasses(): Record<string, boolean> {
    return {
      [`Section--${this.Status()}`]: true
    };
  }

  /**
   * Sets the theme transition duration.
   */
  public SetThemeTransitionDuration(Duration: number): void {
    this.ThemeTransitionDuration.set(Duration);
  }

  /**
   * Sets the shared data for the next navigation.
   */
  public SetNavigationData(Data: any): void {
    this.NavigationData.set(Data);
  }

  /**
   * Retrieves and clears the shared navigation data.
   */
  public GetAndClearNavigationData(): any {
    const Data: any = this.NavigationData();
    
    this.NavigationData.set(null);

    return Data;
  }
}
