import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { AuthenticationComponent } from './authentication/authentication';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'authentication', component: AuthenticationComponent },
];