import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

import {
  NbAuthComponent
} from '@nebular/auth';

const routes: Routes = [{
  path: '',
  component: NbAuthComponent,
  children: [{
    path: 'login',
    component: LoginComponent
  }, {
    path: 'logout',
    component: LogoutComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
