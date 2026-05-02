import { Component, inject, signal, WritableSignal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuroraComponent } from './shared/components/standalone/aurora/aurora';
import { DeepBackgroundComponent } from './shared/components/standalone/deep-background/deep-background';

import { DropdownComponent } from './shared/components/standalone/dropdown/dropdown';
import { MinibuttonComponent } from './shared/components/standalone/minibutton/minibutton';
import { MultibuttonComponent } from './shared/components/standalone/multibutton/multibutton';

import { InterfaceService } from './core/services/interface/interface';
import { NavigationService } from './core/services/navigation/navigation';
import { Translations, type TranslationDictionary } from './core/internationalization';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    AuroraComponent,
    DeepBackgroundComponent,
    DropdownComponent,
    MinibuttonComponent,
    MultibuttonComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private Router: Router = inject(Router);
  public InterfaceService: InterfaceService = inject(InterfaceService);
  private NavigationService: NavigationService = inject(NavigationService);

  public SelectedIndex: WritableSignal<number> = signal(0);

  public RouteSelectorItems = [
    { Label: 'house', Action: () => this.NavigateWithAnimation('home') },
    { Label: 'user', Action: () => this.NavigateWithAnimation('authentication') },
  ];

  public LanguageItems = computed(() => {
    return Object.keys(Translations).map(Language => ({
      ID: Language,
      Label: this.InterfaceService.T()[`LanguageName_${Language}` as keyof TranslationDictionary] as string,
      Action: () => this.InterfaceService.SetLanguage(Language)
    }));
  });

  public ThemeIcon = computed(() => {
    return this.InterfaceService.InterfaceType() === 'Primary' 
      ? 'assets/icons/sun.png' 
      : 'assets/icons/moon.png';
  });

  constructor() {
    // Update SelectedIndex based on current route
    this.Router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      const path = url.split('?')[0];
      if (path.includes('authentication')) {
        this.SelectedIndex.set(1);
      } else {
        this.SelectedIndex.set(0);
      }
    });
  }

  public NavigateWithAnimation(Target: string): void {
    this.NavigationService.NavigateWithAnimation(Target);
  }

  public ToggleTheme(Event: MouseEvent): void {
    this.InterfaceService.ToggleInterfaceTypeWithTransition(Event.clientX, Event.clientY);
  }

  public NavigateBack(): void {
    const url = this.Router.url;
    const segments = url.split('/').filter(s => s !== '');
    
    if (segments.length > 0) {
      segments.pop();
      const target = segments.join('/') || '';
      this.NavigateWithAnimation(target);
    }
  }
}
