import { Component, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { FancyUIElementLoadStatusType, LoginData, RegisterData } from '@ervum/types';

import { ButtonComponent } from '../shared/components/standalone/button/button';
import { TextboxComponent } from '../shared/components/standalone/textbox/textbox';
import { MultibuttonComponent } from '../shared/components/standalone/multibutton/multibutton';
import { AuroraComponent } from '../shared/components/standalone/aurora/aurora';
import { ContainerComponent } from '../shared/components/standalone/container/container';

import { AuthenticationService } from '../core/services/authentication/authentication';

import { forkJoin, timer } from 'rxjs'; 



@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    CommonModule,

    ButtonComponent,
    TextboxComponent,
    MultibuttonComponent,
    AuroraComponent,
    ContainerComponent
],
  templateUrl: './authentication.html',
  styleUrl: './authentication.scss'
})
export class AuthenticationComponent {
  @ViewChild('UserIdentifierTextbox') private UserIdentifierTextbox!: TextboxComponent;
  
  @ViewChild('EmailTextbox') private EmailTextbox!: TextboxComponent;
  @ViewChild('PhoneNumberTextbox') private PhoneNumberTextbox!: TextboxComponent;

  @ViewChild('UsernameTextbox') private UsernameTextbox!: TextboxComponent;
  @ViewChild('PasswordTextbox') private PasswordTextbox!: TextboxComponent;

  private AuthenticationService: AuthenticationService = inject(AuthenticationService);
  private Router: Router = inject(Router);

  public CurrentFormType: WritableSignal<'Sign In' | 'Sign Up'> = signal<'Sign In' | 'Sign Up'>('Sign In');

  public AuthenticationButtons = [
    {
      Label: 'Sign In',
      Action: () => this.CurrentFormType.set('Sign In')
    },

    {
      Label: 'Sign Up',
      Action: () => this.CurrentFormType.set('Sign Up')
    }
  ];
  
  public Status: WritableSignal<FancyUIElementLoadStatusType> = signal<FancyUIElementLoadStatusType>('Idle');
  
  public get IsLoading(): Record<string, boolean> {
    return {
      [`Section--${this.Status()}`]: true
    };
  }
  
  NavigateToHome(): void {
    console.log('Navigating to Home Page from the Authentication Component!');
    
    this.Router.navigate(['/']);
  }
  
  HandleSubmit(): void {
    if (this.CurrentFormType() === 'Sign In') {
      this.HandleSignIn();
    } else {
      this.HandleSignUp();
    }
  }

  HandleSignIn(): void {
    console.log('Sign-In attempt initiated from the Authentication Component!');
    
    this.Status.set('Loading');
    
    const UserPayload: LoginData = {
      UserIdentifier: ((this.UserIdentifierTextbox?.InputValue) ?? ''),
      Password: ((this.PasswordTextbox?.InputValue) ?? '')
    };

    forkJoin([
      this.AuthenticationService.Login(UserPayload),

      timer(300)
    ]).subscribe({
      next: (Response) => {
        console.log('Successfully signed in:', Response);

        this.Status.set('Success');
        
        setTimeout(() => this.Status.set('Idle'), 3000);
      },
      error: (Error) => {
        console.error('Error signing in:', Error);

        this.Status.set('Error');

        setTimeout(() => this.Status.set('Idle'), 3000);
      }
    });
  }

  HandleSignUp(): void {
    console.log('Sign-Up attempt initiated from the Authentication Component!');
    
    this.Status.set('Loading');

    const UserPayload: RegisterData = {
      Email: ((this.EmailTextbox?.InputValue) ?? ''),
      PhoneNumber: ((this.PhoneNumberTextbox?.InputValue) ?? ''),

      Username: ((this.UsernameTextbox?.InputValue) ?? ''),
      Password: ((this.PasswordTextbox?.InputValue) ?? '')
    };

    forkJoin([
      this.AuthenticationService.Register(UserPayload),

      timer(300)
    ]).subscribe({
      next: (Response) => {
        console.log('Successfully signed up:', Response);

        this.Status.set('Success');

        setTimeout(() => this.Status.set('Idle'), 3000);
      },
      error: (Error) => {
        console.error('Error signing up:', Error);

        this.Status.set('Error');

        setTimeout(() => this.Status.set('Idle'), 3000);
      }
    });
  }
}
