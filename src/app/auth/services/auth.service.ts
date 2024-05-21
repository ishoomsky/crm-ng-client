import { Injectable, signal } from '@angular/core';
import { CurrentUserInterface } from "../types/current-user.interface";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { RegisterRequestInterface } from "../types/register-request.interface";

@Injectable()
export class AuthService {
  public currentUser = signal<CurrentUserInterface | null | undefined>(undefined);
  constructor(
    private httpClient: HttpClient,
  ) {}

  public getCurrentUser(): Observable<CurrentUserInterface> {
    const apiUrl = `${environment.apiUrl}/user`;

    return this.httpClient.get<CurrentUserInterface>(apiUrl);
  }

  public register(registerRequest: RegisterRequestInterface): Observable<CurrentUserInterface> {
    const url = `${environment.apiUrl}/users/register`;

    return this.httpClient.post<CurrentUserInterface>(url, registerRequest);
  }

  public setToken(currentUser: CurrentUserInterface): void {
    localStorage.setItem('token', currentUser.token);
  }

  public setCurrentUser(currentUser: CurrentUserInterface | null): void {
    this.currentUser.set(currentUser);
  }
}
