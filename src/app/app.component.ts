import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from "./auth/services/auth.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CurrentUserInterface } from "./auth/types/current-user.interface";
import { SocketService } from "@app/shared/services/socket.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private socketService = inject(SocketService);

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .subscribe({
        next: (currentUser) => {
          this.socketService.setupSocketConnection(currentUser);
          this.authService.setCurrentUser(currentUser);
        },
        error: () => {
          this.authService.setCurrentUser(null);
        },
      })
  }
}
