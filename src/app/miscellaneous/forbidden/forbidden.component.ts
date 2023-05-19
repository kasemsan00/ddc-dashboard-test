import { NbMenuService } from '@nebular/theme';
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-forbidden',
  styleUrls: ['./forbidden.component.scss'],
  templateUrl: './forbidden.component.html',
})
export class ForbiddenComponent {

  system: string = "OIS"

  constructor(private menuService: NbMenuService, private auth: AuthService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    const system = this.route.snapshot.paramMap.get('system');
    if (system != null) {
      this.system = system
    }
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  logout() {
    this.auth.logout()
  }
}
