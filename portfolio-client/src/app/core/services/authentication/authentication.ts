import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ClientConfiguration as Configuration } from '@ervum/shared-configuration';

import { LoginData, RegisterData } from '@ervum/types';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private HTTP: HttpClient = inject(HttpClient);

  private DatabaseURL: string = (Configuration.SlashedProxyURL);

  Login(UserData: LoginData): Observable<LoginData> {
    return this.HTTP.post<LoginData>(`${this.DatabaseURL}/authentication/login`, UserData);
  }

  Register(UserData: RegisterData): Observable<RegisterData> {
    return this.HTTP.post<RegisterData>(`${this.DatabaseURL}/authentication/register`, UserData);
  }
}