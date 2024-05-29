import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import { LoginRequestInterface } from "../../types/login-request.interface";
interface LoginFormInterface {
  email: FormControl<string>,
  password: FormControl<string>,
}
@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
        FormsModule,
        NgIf,
        ReactiveFormsModule,
        RouterLink
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public form: FormGroup<LoginFormInterface>;
  public errorMessage?: string | null;


  constructor() {
    this.form = new FormGroup({
      email: new FormControl('', {nonNullable: true}),
      password: new FormControl('', {nonNullable: true}),
    })
  }

  public onSubmit() {
    if (!this.form) return;

    const registerRequestData: LoginRequestInterface = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
    };

    this.authService.login(registerRequestData)
      .subscribe({
        next: (currentUser) => {
          this.authService.setToken(currentUser);
          this.authService.setCurrentUser(currentUser);
          this.errorMessage = null;

          this.router.navigateByUrl('/');
        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
          this.errorMessage = error.error.emailOrPassword;
        }
      })
  }
}
