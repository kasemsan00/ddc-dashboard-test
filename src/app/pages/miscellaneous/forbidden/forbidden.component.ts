import { NbMenuService } from '@nebular/theme';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'd1442-dashboard-forbidden',
  styleUrls: ['./forbidden.component.scss'],
  templateUrl: './forbidden.component.html',
})
export class ForbiddenComponent implements OnInit {
  system: string = 'OIS';

  constructor(
    private menuService: NbMenuService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const system = this.route.snapshot.paramMap.get('system');
    if (system != null) {
      this.system = system;
    }
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  logout() {
    this.auth.logout();
  }
}
