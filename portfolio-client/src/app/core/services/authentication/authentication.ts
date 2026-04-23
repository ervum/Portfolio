import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ClientConfiguration as Configuration } from '@ervum/shared-configuration';

import { LoginData, RegisterData } from '@ervum/types';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly HTTP: HttpClient = inject(HttpClient);

  private readonly DatabaseURL: string = (Configuration.SlashedProxyURL);

  /** Sends a login request to the server. */
  public Login(UserData: LoginData): Observable<LoginData> {
    return this.HTTP.post<LoginData>(`${this.DatabaseURL}/authentication/login`, UserData);
  }

  /** Sends a registration request to the server. */
  public Register(UserData: RegisterData): Observable<RegisterData> {
    return this.HTTP.post<RegisterData>(`${this.DatabaseURL}/authentication/register`, UserData);
  }
}