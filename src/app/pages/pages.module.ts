import { NgModule } from '@angular/core';
import {
  NbMenuModule,
  NbCardModule,
  NbUserModule,
  NbListModule,
  NbAlertModule,
  NbIconModule,
  NbBadgeModule,
  NbProgressBarModule,
  NbButtonModule,
  NbRadioModule,
  NbSelectModule,
  NbSidebarModule,
  NbDialogModule,
  NbToastrModule,
} from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule.forRoot(),
    NbCardModule,
    NbUserModule,
    NbListModule,
    NbAlertModule,
    NbIconModule,
    NbBadgeModule,
    NbProgressBarModule,
    NbButtonModule,
    NbRadioModule,
    NbSelectModule,
    NbToastrModule.forRoot(),
    NbDialogModule.forRoot(),
    NbSidebarModule.forRoot(),
  ],
  declarations: [PagesComponent],
})
export class PagesModule {}
