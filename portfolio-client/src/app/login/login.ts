import { Component } from '@angular/core';

import { ButtonComponent } from '../shared/components/standalone/button/button';
import { TextboxComponent } from '../shared/components/standalone/textbox/textbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, TextboxComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  HandleLogin(): void {
    console.log('Login attempt initiated from the login component!');
  }
}
