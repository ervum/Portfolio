import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { AuthenticationComponent } from './authentication/authentication';
import { AnimationGuard } from './core/guards/animation.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canDeactivate: [AnimationGuard] },
    { path: 'authentication', component: AuthenticationComponent, canDeactivate: [AnimationGuard] },
    { path: 'authentication/recovery', loadComponent: () => import('./authentication/recovery/recovery').then(m => m.RecoveryComponent), canDeactivate: [AnimationGuard] },
];