import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, AuthResponse } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  authForm!: FormGroup;
  isloginMode = false;
  isLoading = false;
  error = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }
  get email(): FormControl {
    return <FormControl>this.authForm.get('email');
  }
  get password(): FormControl {
    return <FormControl>this.authForm.get('password');
  }

  onSwitchMode(): void {
    this.isloginMode = !this.isloginMode;
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      this.isLoading = true;
      if (this.isloginMode) {
        this.authService.signin(this.authForm.value).subscribe(
          () => {
            this.error = '';
          },
          (error) => {
            this.isLoading = false;
            this.error = error.error.error.message;
          }
        );
      } else {
        this.authService.signup(this.authForm.value).subscribe(
          () => {
            this.error = '';
          },
          (error) => {
            this.isLoading = false;
            this.error = error.error.error.message;
          }
        );
      }
      this.authForm.reset();
    }
  }
}
