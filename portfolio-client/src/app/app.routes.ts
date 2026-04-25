import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { AuthenticationComponent } from './authentication/authentication';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'authentication', component: AuthenticationComponent },
];