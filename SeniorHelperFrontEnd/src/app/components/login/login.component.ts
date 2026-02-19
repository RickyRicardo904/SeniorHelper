import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  remember = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(form: NgForm) {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Please enter your username and password.';
      return;
    }

    this.loading = true;

    this.authService
      .login({ username: this.username.trim(), password: this.password })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (resp) => {
          this.loading = false;
          // Persist token + username in one place so route guards can read auth state.
          this.authService.persistSession(resp.token, this.username.trim(), this.remember);
          this.successMessage = resp.message || 'Signed in successfully.';
          // If user was redirected to login by a guard, send them back where they started.
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          const destination = returnUrl && returnUrl.startsWith('/') ? returnUrl : '/home';
          this.router.navigateByUrl(destination);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;
          const msg =
            err?.error?.message ||
            err?.error?.error ||
            'Login failed. Please check your credentials.';
          this.errorMessage = msg;
          this.cdr.detectChanges();
        }
      });
  }
}
