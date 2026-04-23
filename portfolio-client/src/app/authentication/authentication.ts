import { Component, inject, signal, ViewChild, WritableSignal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { FancyUIElementLoadStatusType, LoginData, RegisterData } from '@ervum/types';

import { MultibuttonComponent } from '../shared/components/standalone/multibutton/multibutton';
import { ButtonComponent } from '../shared/components/standalone/button/button';
import { TextboxComponent } from '../shared/components/standalone/textbox/textbox';
import { CheckboxComponent } from '../shared/components/standalone/checkbox/checkbox';
import { ContainerComponent } from '../shared/components/standalone/container/container';
import { AuroraComponent } from '../shared/components/standalone/aurora/aurora';
import { DropdownComponent } from '../shared/components/standalone/dropdown/dropdown';

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
    TypewriterDirective
],
  templateUrl: './authentication.html',
  styleUrl: './authentication.scss'
})
export class AuthenticationComponent {
  @ViewChild('IdentifierTextbox') private IdentifierTextbox!: TextboxComponent;
  @ViewChild('EmailTextbox') private EmailTextbox!: TextboxComponent;
  @ViewChild('PhoneNumberTextbox') private PhoneNumberTextbox!: TextboxComponent;
  @ViewChild('PasswordTextbox') private PasswordTextbox!: TextboxComponent;

  private AuthenticationService: AuthenticationService = inject(AuthenticationService);
  private Router: Router = inject(Router);
  public InterfaceService: InterfaceService = inject(InterfaceService);

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
    { Label: 'house', Action: () => console.log('User selected') },
    { Label: 'user', Action: () => console.log('Envelope selected') },
  ];

  public LanguageItems = computed(() => {
    return Object.keys(Translations).map(Language => ({
      ID: Language,
      Label: this.InterfaceService.T()[`LanguageName_${Language}` as keyof TranslationDictionary] as string,
      Action: () => this.InterfaceService.SetLanguage(Language)
    }));
  });
  
  public Status: WritableSignal<FancyUIElementLoadStatusType> = signal<FancyUIElementLoadStatusType>('Idle');
  
  public get IsLoading(): Record<string, boolean> {
    return {
      [`Section--${this.Status()}`]: true
    };
  }
  
  /** Navigates back to the home page. */
  public NavigateToHome(): void {
    console.log('Navigating to Home Page from the Authentication Component!');
    
    this.Router.navigate(['/']);
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

  /** Toggles the global interface theme between Primary and Secondary. */
  public ToggleTheme(): void {
    this.InterfaceService.ToggleInterfaceType();
  }
}
