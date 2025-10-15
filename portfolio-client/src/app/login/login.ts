import { Component } from '@angular/core';

import { ButtonComponent } from '../shared/components/standalone/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  HandleLogin(): void {
    console.log('Login attempt initiated from the login component!');
    // TODO: Implement login logic (e.g., call an authentication service)
  }
}
