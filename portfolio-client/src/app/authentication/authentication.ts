import { Component, inject, signal, ViewChild, WritableSignal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { FancyUIElementLoadStatusType, LoginData, RegisterData } from '@ervum/types';

import { MultibuttonComponent } from '../shared/components/standalone/multibutton/multibutton';
import { ButtonComponent } from '../shared/components/standalone/button/button';
import { TextboxComponent } from '../shared/components/standalone/textbox/textbox';
import { CheckboxComponent } from '../shared/components/standalone/checkbox/checkbox';
import { ContainerComponent } from '../shared/components/standalone/container/container';
import { AuroraComponent } from '../shared/components/standalone/aurora/aurora';
import { DropdownComponent } from '../shared/components/standalone/dropdown/dropdown';
import { MinibuttonComponent } from '../shared/components/standalone/minibutton/minibutton';

import { AuthenticationService } from '../core/services/authentication/authentication';
import { InterfaceService } from '../core/services/interface/interface';
import { Translations, type TranslationDictionary } from '../core/internationalization';
import { TypewriterDirective } from '../shared/directives/typewriter/typewriter.directive';

import { forkJoin, timer } from 'rxjs'; 



@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    CommonModule,

    MultibuttonComponent,
    ButtonComponent,
    TextboxComponent,
    CheckboxComponent,
    ContainerComponent,
    AuroraComponent,
    DropdownComponent,
    TypewriterDirective,
    MinibuttonComponent
],
  templateUrl: './authentication.html',
  styleUrl: './authentication.scss',
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
export class AuthenticationComponent implements OnInit {
  @ViewChild('IdentifierTextbox') private IdentifierTextbox!: TextboxComponent;
  @ViewChild('EmailTextbox') private EmailTextbox!: TextboxComponent;
  @ViewChild('PhoneNumberTextbox') private PhoneNumberTextbox!: TextboxComponent;
  @ViewChild('PasswordTextbox') private PasswordTextbox!: TextboxComponent;

  private AuthenticationService: AuthenticationService = inject(AuthenticationService);
  private Router: Router = inject(Router);
  private ActivatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public InterfaceService: InterfaceService = inject(InterfaceService);

  public CurrentAnimationState: WritableSignal<'In' | 'Out'> = signal<'In' | 'Out'>('In');

  public CurrentFormType: WritableSignal<'Sign In' | 'Sign Up'> = signal<'Sign In' | 'Sign Up'>('Sign In');

  public AuthenticationButtons = computed(() => [
    {
      Label: this.InterfaceService.T().SignIn,
      Action: () => this.CurrentFormType.set('Sign In')
    },
    {
      Label: this.InterfaceService.T().SignUp,
      Action: () => this.CurrentFormType.set('Sign Up')
    }
  ]);

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
  
  public Status: WritableSignal<FancyUIElementLoadStatusType> = signal<FancyUIElementLoadStatusType>('Idle');
  
  public get IsLoading(): Record<string, boolean> {
    return {
      [`Section--${this.Status()}`]: true
    };
  }
  
  
  /** Classes for the form fields wrapper (sign-up expanded state). */
  public get GetFormFieldsClasses(): Record<string, boolean> {
    return {
      'Is-SignUp': (this.CurrentFormType() === 'Sign Up')
    };
  }

  /** Navigates back to the home page. */
  public NavigateToHome(): void {
    this.NavigateWithAnimation('home');
  }

  public ngOnInit(): void {
    // Only animate if the redirect query parameter is present
    const RedirectSource = this.ActivatedRoute.snapshot.queryParamMap.get('redirect');
    
    if (RedirectSource) {
      this.CurrentAnimationState.set('Out');
      setTimeout(() => this.CurrentAnimationState.set('In'), 0);
    } else {
      this.CurrentAnimationState.set('In');
    }
  }

  /** Triggers the exit animation before navigating to the target route. */
  public NavigateWithAnimation(Target: string): void {
    const CurrentPath = this.Router.url.split('?')[0];
    const TargetPath = `/${Target}`;
    
    // Exact match or root redirect check
    if (CurrentPath === TargetPath || (Target === 'home' && CurrentPath === '/')) return;

    this.CurrentAnimationState.set('Out');

    setTimeout(() => {
      this.Router.navigate([`/${Target}`], { queryParams: { redirect: 'authentication' } });
    }, 600); // Wait for the core part of the animation to complete
  }
  
  /** Delegates to the appropriate sign-in or sign-up handler based on the current form type. */
  public HandleSubmit(): void {
    if (this.CurrentFormType() === 'Sign In') {
      this.HandleSignIn();
    } else {
      this.HandleSignUp();
    }
  }

  /** Sends a sign-in request with the current form values. */
  public HandleSignIn(): void {
    console.log('Sign-In attempt initiated from the Authentication Component!');
    
    this.Status.set('Loading');
    
    const UserPayload: LoginData = {
      UserIdentifier: ((this.IdentifierTextbox?.InputValue) ?? ''),
      Password: ((this.PasswordTextbox?.InputValue) ?? '')
    };

    forkJoin([
      this.AuthenticationService.Login(UserPayload),

      timer(300)
    ]).subscribe({
      next: (Response: [LoginData, number]) => {
        console.log('Successfully signed in:', Response);

        this.Status.set('Success');
        
        setTimeout(() => this.Status.set('Idle'), 3000);
      },
      error: (Err: unknown) => {
        console.error('Error signing in:', Err);

        this.Status.set('Error');

        setTimeout(() => this.Status.set('Idle'), 3000);
      }
    });
  }

  /** Sends a sign-up request with the current form values. */
  public HandleSignUp(): void {
    console.log('Sign-Up attempt initiated from the Authentication Component!');
    
    this.Status.set('Loading');

    const UserPayload: RegisterData = {
      Email: ((this.EmailTextbox?.InputValue) ?? ''),
      PhoneNumber: ((this.PhoneNumberTextbox?.InputValue) ?? ''),

      Username: ((this.IdentifierTextbox?.InputValue) ?? ''),
      Password: ((this.PasswordTextbox?.InputValue) ?? '')
    };

    forkJoin([
      this.AuthenticationService.Register(UserPayload),

      timer(300)
    ]).subscribe({
      next: (Response: [RegisterData, number]) => {
        console.log('Successfully signed up:', Response);

        this.Status.set('Success');

        setTimeout(() => this.Status.set('Idle'), 3000);
      },
      error: (Err: unknown) => {
        console.error('Error signing up:', Err);

        this.Status.set('Error');

        setTimeout(() => this.Status.set('Idle'), 3000);
      }
    });
  }

  /** Toggles the global interface theme with a circular ripple transition from the click origin. */
  public ToggleTheme(Event: MouseEvent): void {
    this.InterfaceService.ToggleInterfaceTypeWithTransition(Event.clientX, Event.clientY);
  }
}
