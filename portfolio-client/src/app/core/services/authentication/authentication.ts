import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ClientConfiguration as Configuration } from '@ervum/shared-configuration';

export interface RegisterData {
  UserIdentifier: string;
  Password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private HTTP: HttpClient = inject(HttpClient);

  private DatabaseURL: string = (Configuration.SlashedProxyURL);

  Register(UserData: RegisterData): Observable<RegisterData> {
    return this.HTTP.post<RegisterData>(`${this.DatabaseURL}/authentication/register`, UserData);
  }
}