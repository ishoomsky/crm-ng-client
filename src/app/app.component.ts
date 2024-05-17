import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from "./auth/services/auth.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CurrentUserInterface } from "./auth/types/current-user.interface";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  providers: [AuthService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ng-client-web';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .subscribe({
        next: (currentUserInterface) => {
          console.log('currentUserInterface', currentUserInterface)
        },
        error: () => {
          this.authService.setCurrentUser(null);
        },
      })
  }
}
