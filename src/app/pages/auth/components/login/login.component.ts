import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '../../services/app-config.service';

@Component({
  selector: 'd1442-dashboard-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isAuthenticated$: Observable<boolean>;
  isDoneLoading$: Observable<boolean>;
  canActivateProtectedRoutes$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private environment: AppConfigService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.isDoneLoading$ = this.authService.isDoneLoading$;
    this.canActivateProtectedRoutes$ =
      this.authService.canActivateProtectedRoutes$;
    // redirect to home if already logged in
    if (this.isAuthenticated$) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    const app_name = this.environment.config.app_name;
    console.log('app_name', app_name);
  }

  login() {
    this.authService.login();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
