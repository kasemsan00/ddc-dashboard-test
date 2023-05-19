import { NgModule } from '@angular/core';
import { ThemeModule } from '../@theme/theme.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from '../services/auth.service'
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
} from '@nebular/theme';

@NgModule({
  imports: [
    AuthRoutingModule,
    ThemeModule,
    NbButtonModule,
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
  ],
  providers: [
    AuthService,
  ]
})
export class AuthModule {
}
