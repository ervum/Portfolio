import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonComponent } from '../shared/components/standalone/button/button';
import { TextboxComponent } from '../shared/components/standalone/textbox/textbox';
import { MultibuttonComponent } from '../shared/components/standalone/multibutton/multibutton';

import { AuthenticationService } from '../core/services/authentication/authentication';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonComponent, 
    TextboxComponent,
    MultibuttonComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  @ViewChild('UserIdentifierTextbox') private UserIdentifierTextbox!: TextboxComponent;
  @ViewChild('PasswordTextbox') private PasswordTextbox!: TextboxComponent;

  private AuthenticationService: AuthenticationService = inject(AuthenticationService);
  private Router: Router = inject(Router);

  NavigateToHome(): void {
    console.log('Navigating to home page from the login component!');
    
    this.Router.navigate(['/']);
  }
  
  HandleLogin(): void {
    console.log('Login attempt initiated from the login component!');

    const UserPayload: { 
      UserIdentifier: string,
      Password: string
    } = {
      UserIdentifier: ((this.UserIdentifierTextbox?.InputValue) ?? ''),
      Password: ((this.PasswordTextbox?.InputValue) ?? '')
    };

    this.AuthenticationService.Register(UserPayload).subscribe({
      next: (Response) => {
        console.log('Successfully saved to Postgres:', Response);
      },

      error: (Error) => {
        console.error('Error saving to Postgres:', Error);
      }
    });
  }
}
