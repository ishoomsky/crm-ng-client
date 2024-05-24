import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Subject } from "rxjs";
import { AuthService } from "@app/auth/services/auth.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  private watchIsLoggedIn = effect((onCleanup) => {
    if(this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/boards');
    }
  })
}
