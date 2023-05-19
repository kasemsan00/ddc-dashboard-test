import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import {
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
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { ChartsRoutingModule, routedComponents } from './charts-routing.module';
import { DashboardChartComponent } from './dashboard/dashboard-chart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const components = [DashboardChartComponent];

@NgModule({
  imports: [
    ThemeModule,
    ChartsRoutingModule,
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
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
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  declarations: [...routedComponents, ...components],
})
export class ChartsModule {}
