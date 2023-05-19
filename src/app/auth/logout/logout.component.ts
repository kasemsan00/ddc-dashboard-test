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
  selector: 'd1442-dashboard-logout',
  styleUrls: ['./logout.component.scss'],
  templateUrl: './logout.component.html',
})
export class LogoutComponent {
  private sidebarVisible: boolean;
  private nativeElement: Node;

  constructor(
    private element: ElementRef,
    private auth: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  // checkFullPageBackgroundImage() {
  //     var $page = $('.full-page');
  //     var image_src = $page.data('image');

  //     if (image_src !== undefined) {
  //         var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
  //         $page.append(image_container);
  //     }
  // };

  ngOnInit() {
    this.logout();
    this.router.navigate(['/auth/login']);
  }

  logout() {
    console.log('loged out!');
    this.auth.logout();
  }
}
