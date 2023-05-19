import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
  NbThemeService,
  NbColorHelper,
  NbJSThemeOptions,
} from '@nebular/theme';
import { GlobalService } from '../../../services/global.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'd1442-dashboard-chart',
  template: `
    <chart type="line" [data]="data" [options]="options">data_chart</chart>
  `,
})
export class DashboardChartComponent implements OnInit, OnDestroy {
  data: any;
  options: any;
  themeSubscription: Subscription = Subscription.EMPTY;
  chartSubscription: Subscription = Subscription.EMPTY;
  data_chart: any;
  province_id: any;
  user: any;

  @Input() trigger?: any;

  constructor(
    private theme: NbThemeService,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    this.chartSubscription = this.globalService
      .getChartData()
      .subscribe((data) => {
        this.data_chart = JSON.parse(data);
        if (this.data_chart) {
          // @ts-ignore
          this.data_chart.labels = this.data_chart.labels.map((x) => {
            let unix_timestamp = x;
            var date = new Date(unix_timestamp * 1000);
            var hours = date.getHours();
            var minutes = '0' + date.getMinutes();
            var formattedTime = hours + ':' + minutes.substr(-2);
            return formattedTime;
          });
          this.initChart();
        }
      });
  }

  initChart() {
    if (localStorage.getItem('chart_format') === null) {
      localStorage.setItem('chart_format', '24hr');
    }
    if (localStorage.getItem('incoming_label') === null) {
      localStorage.setItem('incoming_label', 'show');
    }
    if (localStorage.getItem('answered_label') === null) {
      localStorage.setItem('answered_label', 'show');
    }
    if (localStorage.getItem('abandoned_label') === null) {
      localStorage.setItem('abandoned_label', 'show');
    }
    this.themeSubscription = this.theme
      .getJsTheme()
      .subscribe((config: NbJSThemeOptions) => {
        const colors: any = config.variables;
        // @ts-ignore
        const chartjs: any = config.variables!.chartjs;

        this.data = {
          labels: this.data_chart.labels,
          datasets: [
            {
              data: this.data_chart.incoming,
              label: 'Incoming',
              backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
              borderColor: colors.primary,
              fill: false,
              hidden:
                localStorage.getItem('incoming_label') == 'show' ? false : true,
            },
            {
              data: this.data_chart.answer,
              label: 'Answered',
              backgroundColor: NbColorHelper.hexToRgbA(colors.success, 0.3),
              borderColor: colors.success,
              fill: false,
              hidden:
                localStorage.getItem('answered_label') == 'show' ? false : true,
            },
            {
              data: this.data_chart.abandon,
              label: 'Abandoned',
              backgroundColor: NbColorHelper.hexToRgbA(colors.danger, 0.3),
              borderColor: colors.danger,
              fill: false,
              hidden:
                localStorage.getItem('abandoned_label') == 'show'
                  ? false
                  : true,
            },
          ],
        };

        this.options = {
          responsive: true,
          maintainAspectRatio: false,
          // onClick: (clickEvt, activeElems) => this.onChartClick(clickEvt, activeElems),
          animation: {
            duration: 0,
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: true,
                  color: chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: chartjs.textColor,
                  stepSize: 1,
                  min: 0,
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  display: true,
                  color: chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: chartjs.textColor,
                  stepSize: 1,
                  min: 0,
                },
              },
            ],
            xAxis: {
              min: 0,
            },
            yAxis: {
              min: 0,
            },
          },
          legend: {
            labels: {
              fontColor: chartjs.textColor,
            },
          },
        };
      });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription && !this.themeSubscription.closed)
      this.themeSubscription.unsubscribe();

    if (this.chartSubscription && !this.chartSubscription.closed)
      this.chartSubscription.unsubscribe();
  }

  onChartClick(clickEvt: MouseEvent, activeElems: Array<any>) {
    //if click was on a bar, we don't care (we want clicks on labels)
    if (activeElems && activeElems.length) return;

    // let clickY = this.chart.scales['y-axis-0'].getValueForPixel(clickEvt.clientY);
    // this.y_clicked = clickY;
    // if(this.timeoutID) clearTimeout(this.timeoutID); //cancel any running timer
    // this.timeoutID = setTimeout(()=>this.y_clicked=null,2000); //clear the value

    console.log(clickEvt);
  }
}
