import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  onSubmit() {
    if (this.username === 'admin' && this.password === 'password123') {
      console.log('Login successful!');
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Invalid username or password.';
    }
  }
}
