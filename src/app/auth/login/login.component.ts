import { Component, OnInit, ElementRef } from '@angular/core';
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { AuthService } from '../../services/auth.service';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { of, race, BehaviorSubject, Observable } from 'rxjs';

// declare var $: any;

@Component({
  selector: 'd1442-dashboard-login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private sidebarVisible: boolean;
  private nativeElement: Node;
  private toggleButton: any;

  constructor(
    private element: ElementRef,
    private auth: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    if (
      this.location.path() === '/auth/login' &&
      this.auth.hasValidAccessToken()
    ) {
      // this.logout();
      this.router.navigate(['/']);
    } else {
      // alert("ok")
    }

    // this.checkFullPageBackgroundImage();
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
  }

  login() {
    if (
      this.location.path() === '/auth/login' &&
      this.auth.hasValidAccessToken()
    ) {
      // this.logout();
      this.router.navigate(['/']);
    } else {
      this.auth.login();
    }
  }

  logout() {
    console.log('loged out!');
    this.auth.logout();
  }
}
