import { Component, inject, signal, WritableSignal, computed, type Signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, NavigationStart } from '@angular/router';


import { Undefinable, FancyMultibuttonItemType, FancyDropdownItemType } from '@ervum/types';

import { filter } from 'rxjs';

import { AuroraComponent } from './shared/components/standalone/aurora/aurora';
import { DeepBackgroundComponent } from './shared/components/standalone/deep-background/deep-background';

import { DropdownComponent } from './shared/components/standalone/dropdown/dropdown';
import { MinibuttonComponent } from './shared/components/standalone/minibutton/minibutton';
import { MultibuttonComponent } from './shared/components/standalone/multibutton/multibutton';

import { InterfaceService } from './core/services/interface/interface';
import { NavigationService } from './core/services/navigation/navigation';

import { Translations, type TranslationDictionary } from './core/internationalization';



const RouteSelectorIndices: Record<string, number> = {
  '/': 0,
  '/home': 0,
  '/authentication': 1,
  '/authentication/recovery': 1
};




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
  private Location: Location = inject(Location);

  private NavigationService: NavigationService = inject(NavigationService);
  public InterfaceService: InterfaceService = inject(InterfaceService);

  public SelectedIndex: WritableSignal<number> = signal(this.GetSelectedIndex(this.Location.path()));

  public RouteSelectorItems: FancyMultibuttonItemType[] = [
    { Label: 'house', Action: () => this.NavigateWithAnimation('home') },
    { Label: 'user', Action: () => this.NavigateWithAnimation('authentication') },
  ];

  private SyncSelectedIndexWithRoute(): void {
    this.SelectedIndex.set(this.GetSelectedIndex(this.Router.url));
  }

  private GetSelectedIndex(path: string): number {
    return RouteSelectorIndices[path.split('?')[0]] ?? 0;
  }

  public LanguageItems: Signal<FancyDropdownItemType[]> = computed(() => {
    return Object.keys(Translations).map((Language: string) => ({
      ID: Language,
      Label: this.InterfaceService.T()[`LanguageName_${Language}` as keyof TranslationDictionary] as string,

      Action: () => this.InterfaceService.SetLanguage(Language)
    }));
  });

  public CurrentLanguageItem: Signal<Undefinable<FancyDropdownItemType>> = computed(() => {
    const CurrentLanguage: string = this.InterfaceService.Language();

    return this.LanguageItems().find(Item => Item.ID === CurrentLanguage);
  });

  public ThemeIcon: Signal<string> = computed(() => {
    return this.InterfaceService.InterfaceType() === 'Primary' 
      ? 'assets/icons/sun.png' 
      : 'assets/icons/moon.png';
  });

  public NavigateWithAnimation(Target: string): void {
    this.NavigationService.NavigateWithAnimation(Target);
  }

  public ToggleTheme(Event: MouseEvent): void {
    this.InterfaceService.ToggleInterfaceTypeWithTransition(Event.clientX, Event.clientY);
  }

  public NavigateBack(): void {
    const URL: string = this.Router.url;
    const Segments: string[] = URL.split('/').filter(s => s !== '');
    
    if ((Segments.length) > 0) {
      Segments.pop();

      const Target: string = Segments.join('/') || '';
      this.NavigateWithAnimation(Target);
    }
  }

  constructor() {
    this.Router.events.pipe(
      filter((Event): Event is NavigationEnd | NavigationStart => 
        Event instanceof NavigationEnd || Event instanceof NavigationStart
      )
    ).subscribe((Event) => {
      this.SelectedIndex.set(this.GetSelectedIndex(Event.url));
    });
  }
}
