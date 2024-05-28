import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "@app/auth/services/auth.service";

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
