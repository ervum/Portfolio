import { Component, inject, signal, WritableSignal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { MultibuttonComponent } from '../shared/components/standalone/multibutton/multibutton';
import { ContainerComponent } from '../shared/components/standalone/container/container';
import { AuroraComponent } from '../shared/components/standalone/aurora/aurora';
import { DropdownComponent } from '../shared/components/standalone/dropdown/dropdown';
import { MinibuttonComponent } from '../shared/components/standalone/minibutton/minibutton';

import { InterfaceService } from '../core/services/interface/interface';
import { Translations, type TranslationDictionary } from '../core/internationalization';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MultibuttonComponent,
    ContainerComponent,
    AuroraComponent,
    DropdownComponent,
    MinibuttonComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  animations: [
    trigger('SlideUpDown', [
      state('In', style({ transform: 'translateY(0)', opacity: 1 })),
      state('Out', style({ transform: 'translateY(100vh)', opacity: 0 })),
      transition('* => In', [
        animate('0.8s cubic-bezier(0.86, 0, 0.07, 1)')
      ]),
      transition('In => Out', [
        animate('0.8s cubic-bezier(0.86, 0, 0.07, 1)')
      ]),
    ])
  ]
})
export class HomeComponent implements OnInit {
  private Router: Router = inject(Router);
  private ActivatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public InterfaceService: InterfaceService = inject(InterfaceService);

  public CurrentAnimationState: WritableSignal<'In' | 'Out'> = signal<'In' | 'Out'>('In');

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

  public ngOnInit(): void {
    const RedirectSource = this.ActivatedRoute.snapshot.queryParamMap.get('redirect');
    
    if (RedirectSource) {
      this.CurrentAnimationState.set('Out');
      setTimeout(() => this.CurrentAnimationState.set('In'), 0);
    } else {
      this.CurrentAnimationState.set('In');
    }
  }

  public NavigateWithAnimation(Target: string): void {
    const CurrentPath = this.Router.url.split('?')[0];
    const TargetPath = `/${Target}`;
    
    // Exact match or root redirect check
    if (CurrentPath === TargetPath || (Target === 'home' && CurrentPath === '/')) return;

    this.CurrentAnimationState.set('Out');

    setTimeout(() => {
      this.Router.navigate([`/${Target}`], { queryParams: { redirect: 'home' } });
    }, 600);
  }

  public ToggleTheme(Event: MouseEvent): void {
    this.InterfaceService.ToggleInterfaceTypeWithTransition(Event.clientX, Event.clientY);
  }
}
