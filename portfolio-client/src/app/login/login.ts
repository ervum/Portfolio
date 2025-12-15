import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonComponent } from '../shared/components/standalone/button/button';
import { TextboxComponent } from '../shared/components/standalone/textbox/textbox';

import { AuthenticationService } from '../core/services/authentication/authentication';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, TextboxComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private AuthenticationService: AuthenticationService = inject(AuthenticationService);
  private Router: Router = inject(Router);

  NavigateToHome(): void {
    console.log('Navigating to home page from the login component!');
    
    this.Router.navigate(['/']);
  }
  
  HandleLogin(): void {
    console.log('Login attempt initiated from the login component!');

    const UserPayload = {
      Username: 'TestUser',
      Password: 'TestPassword'
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
