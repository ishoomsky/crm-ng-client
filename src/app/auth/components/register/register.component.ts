import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { RegisterRequestInterface } from "../../types/register-request.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { NgIf } from "@angular/common";


interface RegisterFormInterface {
  email: FormControl<string>,
  password: FormControl<string>,
  username: FormControl<string>,
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public form: FormGroup<RegisterFormInterface>;
  public error?: string | null;


  constructor() {
    this.form = new FormGroup({
      email: new FormControl('', {nonNullable: true}),
      password: new FormControl('', {nonNullable: true}),
      username: new FormControl('', {nonNullable: true}),
    })
  }

  public onSubmit() {
    if (!this.form) return;

    const registerRequestData: RegisterRequestInterface = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
      username: this.form.controls.username.value,
    };

    this.authService.register(registerRequestData)
      .subscribe({
        next: (currentUser) => {
          console.log('currentUser', currentUser)

          this.authService.setToken(currentUser);
          this.authService.setCurrentUser(currentUser);
          this.error = null;
          this.router.navigateByUrl('/');
        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
          this.error = error.error.join(', ');
        }
      })
  }
}
