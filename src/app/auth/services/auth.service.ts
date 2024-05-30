import { Injectable, signal } from '@angular/core';
import { CurrentUserInterface } from "../types/current-user.interface";
import { filter, map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "@environments/environment";
import { RegisterRequestInterface } from "../types/register-request.interface";
import { LoginRequestInterface } from "../types/login-request.interface";
import { toObservable } from "@angular/core/rxjs-interop";
import { SocketService } from "@app/shared/services/socket.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser = signal<CurrentUserInterface | null | undefined>(undefined);
  public isLoggedIn = signal<boolean | undefined>(undefined);
  public isLogged$ = toObservable(this.currentUser).pipe(
    filter((currentUser) => currentUser !== undefined),
    map(Boolean),
  );
  constructor(
    private httpClient: HttpClient,
    private socketService: SocketService,
  ) {}

  public getCurrentUser(): Observable<CurrentUserInterface> {
    const apiUrl = `${environment.apiUrl}/user`;

    return this.httpClient.get<CurrentUserInterface>(apiUrl);
  }

  public register(registerRequest: RegisterRequestInterface): Observable<CurrentUserInterface> {
    const url = `${environment.apiUrl}/users/register`;
    return this.httpClient.post<CurrentUserInterface>(url, registerRequest);
  }

  public login(loginRequest: LoginRequestInterface): Observable<CurrentUserInterface> {
    const url = `${environment.apiUrl}/users/login`;
    return this.httpClient.post<CurrentUserInterface>(url, loginRequest);
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.socketService.disconnect()
  }

  public setToken(currentUser: CurrentUserInterface): void {
    localStorage.setItem('token', currentUser.token);
  }

  public setCurrentUser(currentUser: CurrentUserInterface | null): void {
    this.currentUser.set(currentUser);

    if (currentUser) {
      this.isLoggedIn.set(true);
    } else {
      this.isLoggedIn.set(false);
    }
  }
}
