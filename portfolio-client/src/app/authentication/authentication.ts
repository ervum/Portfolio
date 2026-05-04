import { Component, inject, signal, ViewChild, WritableSignal, computed, OnInit, type Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { FancyUIElementLoadStatusType, LoginData, RegisterData, FancyMultibuttonItemType } from '@ervum/types';

import { MultibuttonComponent } from '../shared/components/standalone/multibutton/multibutton';
import { ButtonComponent } from '../shared/components/standalone/button/button';
import { TextboxComponent } from '../shared/components/standalone/textbox/textbox';
import { CheckboxComponent } from '../shared/components/standalone/checkbox/checkbox';
import { ContainerComponent } from '../shared/components/standalone/container/container';

import { TypewriterDirective } from '../shared/directives/typewriter/typewriter.directive';
import { SlideUpDownDirective } from '../shared/directives/slide-up-down/slide-up-down.directive';

import { AuthenticationService } from '../core/services/authentication/authentication';
import { InterfaceService } from '../core/services/interface/interface';
import { NavigationService } from '../core/services/navigation/navigation';

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

    TypewriterDirective,
    SlideUpDownDirective
],
  templateUrl: './authentication.html',
  styleUrl: './authentication.scss'
})
export class AuthenticationComponent implements OnInit {
  @ViewChild('MainIdentifierTextbox') private MainIdentifierTextbox!: TextboxComponent;
  @ViewChild('EmailTextbox') private EmailTextbox!: TextboxComponent;
  @ViewChild('PhoneNumberTextbox') private PhoneNumberTextbox!: TextboxComponent;
  @ViewChild('PasswordTextbox') private PasswordTextbox!: TextboxComponent;

  private AuthenticationService: AuthenticationService = inject(AuthenticationService);
  private Router: Router = inject(Router);
  private ActivatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public InterfaceService: InterfaceService = inject(InterfaceService);
  private NavigationService: NavigationService = inject(NavigationService);

  public CurrentFormType: WritableSignal<'Sign In' | 'Sign Up'> = signal<'Sign In' | 'Sign Up'>('Sign In');

  public AuthenticationButtons: Signal<FancyMultibuttonItemType[]> = computed(() => [
    {
      Label: this.InterfaceService.T().SignIn,
      Action: () => this.CurrentFormType.set('Sign In')
    },
    {
      Label: this.InterfaceService.T().SignUp,
      Action: () => this.CurrentFormType.set('Sign Up')
    }
  ]);
  
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
    this.NavigationService.NavigateWithAnimation('home');
  }

  public ngOnInit(): void {
  }

  /** Delegates to the appropriate sign-in or sign-up handler based on the current form type. */
  public HandleSubmit(): void {
    if (this.CurrentFormType() === 'Sign In') {
      this.HandleSignIn();
    } else {
      this.HandleSignUp();
    }
  }

  /** Initiates the account recovery flow. */
  public HandleAccountRecovery(): void {
    this.NavigationService.NavigateWithAnimation('authentication/recovery');
  }

  /** Sends a sign-in request with the current form values. */
  public HandleSignIn(): void {
    console.log('Sign-In attempt initiated from the Authentication Component!');
    
    this.Status.set('Loading');
    
    const UserPayload: LoginData = {
      UserIdentifier: ((this.MainIdentifierTextbox?.InputValue) ?? ''),
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

      Username: ((this.MainIdentifierTextbox?.InputValue) ?? ''),
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
