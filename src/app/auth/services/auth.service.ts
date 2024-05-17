import { Injectable, signal } from '@angular/core';
import { CurrentUserInterface } from "../types/current-user.interface";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

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

  public setCurrentUser(currentUser: CurrentUserInterface | null): void {
    this.currentUser.set(currentUser);
  }
}
