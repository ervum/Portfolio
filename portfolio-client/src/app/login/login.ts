import { Component, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { FancyUIElementLoadStatusType } from '@ervum/types';

import { ButtonComponent } from '../shared/components/standalone/button/button';
import { TextboxComponent } from '../shared/components/standalone/textbox/textbox';
import { MultibuttonComponent } from '../shared/components/standalone/multibutton/multibutton';
import { AuroraComponent } from '../shared/components/standalone/aurora/aurora';

import { AuthenticationService } from '../core/services/authentication/authentication';

import { forkJoin, timer } from 'rxjs'; 



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,

    ButtonComponent,
    TextboxComponent,
    MultibuttonComponent,
    AuroraComponent
],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  @ViewChild('UserIdentifierTextbox') private UserIdentifierTextbox!: TextboxComponent;
  @ViewChild('PasswordTextbox') private PasswordTextbox!: TextboxComponent;

  private AuthenticationService: AuthenticationService = inject(AuthenticationService);
  private Router: Router = inject(Router);

  public AuthenticationButtons: string[] = [
    'Sign In',
    'Sign Up'
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
  
  HandleSignIn(): void {
    console.log('Sign-In attempt initiated from the Authentication Component!');
    
    this.Status.set('Loading');
    
    const UserPayload: { 
      UserIdentifier: string,
      Password: string
    } = {
      UserIdentifier: ((this.UserIdentifierTextbox?.InputValue) ?? ''),
      Password: ((this.PasswordTextbox?.InputValue) ?? '')
    };

    forkJoin([
      this.AuthenticationService.Register(UserPayload),
      timer(300)
    ]).subscribe({
      next: (Response) => {
        console.log('Successfully saved to Postgres:', Response);

        this.Status.set('Success');

        setTimeout(() => {
          this.Status.set('Idle');
        }, 3000);
      },

      error: (Error) => {
        console.error('Error saving to Postgres:', Error);

        this.Status.set('Error');

        setTimeout(() => {
          this.Status.set('Idle');
        }, 3000);
      }
    });
  }
}
