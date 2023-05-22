import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';
import { AuthService } from '../../../pages/auth';
import screenfull from 'screenfull';
import { GlobalService } from '../../../services/global.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'd1442-dashboard-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  noti: any;
  sip_status: any;
  last_update: any;
  agent_data: any;
  agent_mode: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Log out' }];

  dashboard_datetime: any = ''; // '22 February 2020 | 16:33:45'

  url_mode: any = 'mapper'; // url_mapper, url_fixed
  branch_id: any = '';
  branch_name: any = '';

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private breakpointService: NbMediaBreakpointsService,
    private auth: AuthService,
    private globalService: GlobalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.display_realtime_date();
    this.checkLastUpdateTime();
    this.chkNotification();
    this.chkSIPStatus();
    this.chkBranchName();
    this.currentTheme = this.themeService.currentTheme;

    this.globalService.last_update_value.subscribe(
      (data) => (this.last_update = data)
    );
    this.globalService.agent_data_value.subscribe(
      (data) => (this.agent_data = data)
    );

    // this.userService.getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => this.user = users.nick);

    this.user = this.auth.identityClaims;

    this.menuService.onItemClick().subscribe((event) => {
      this.onItemSelection(event.item.title);
    });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName) => (this.currentTheme = themeName));
  }

  chkNotification() {
    this.globalService.special_line_value.subscribe((nextValue) => {
      this.noti = JSON.parse(nextValue);
    });
  }

  chkSIPStatus() {
    this.globalService.sip_status_value.subscribe((nextValue) => {
      this.sip_status = nextValue;
    });
  }

  chkBranchName() {
    this.globalService.branch_name_value.subscribe((nextValue) => {
      this.branch_name = nextValue;
    });
  }

  onItemSelection(title: string) {
    if (title === 'Log out') {
      // Do something on Log out
      console.log('Log out Clicked ');
      this.auth.logout();
    } else if (title === 'Profile') {
      // Do something on Profile
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  display_realtime_date() {
    const delay = 1000; // every 1 sec
    timer(delay, 1000).subscribe((x) => {
      this.dashboard_datetime = new Date();
    });
  }

  checkLastUpdateTime() {
    this.globalService.duration_sync_value.subscribe((nextValue) => {
      let now = Date.now();
      console.log('updated', now);
      this.last_update = now;
    });
  }

  fullscreen() {
    if (screenfull === undefined) return;
    // @ts-ignore
    if (screenfull.isEnabled) {
      // @ts-ignore
      screenfull.request();
    }
  }
}
