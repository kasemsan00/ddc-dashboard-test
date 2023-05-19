import { Component } from '@angular/core';
import {
  NbDialogService,
  NbComponentStatus,
  NbGlobalPosition,
  NbGlobalPhysicalPosition,
  NbToastrConfig,
  NbToastrService,
  NbToastRef,
} from '@nebular/theme';
import { SettingDialogComponent } from '../setting-dialog/setting-dialog.component';

@Component({
  selector: 'd1442-dashboard-toggle-settings-button',
  templateUrl: './toggle-settings-button.component.html',
  styleUrls: ['./toggle-settings-button.component.scss'],
})
export class ToggleSettingsButtonComponent {
  setting: any = {
    chart_format: '24hr',
  };

  // toastr
  toastr_index = 1;
  toastr_destroyByClick = true;
  toastr_duration = 3000;
  toastr_hasIcon = true;
  toastr_position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  toastr_position_call: NbGlobalPosition = NbGlobalPhysicalPosition.BOTTOM_LEFT;
  toastr_preventDuplicates = false;
  toastr_status: NbComponentStatus = 'success';

  toastr_title = 'Notification!';
  toastr_content = `Update setting successfully!`;

  // @ts-ignore
  config: NbToastrConfig;

  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) {}

  toggleSetting() {
    this.dialogService
      .open(SettingDialogComponent, {
        context: {
          title: 'Setting',
        },
      })
      .onClose.subscribe((res) => {
        if (res) {
          this.setting.chart_format = res;
          // this.initDashboard()
          this.showToast(
            this.toastr_status,
            this.toastr_title,
            this.toastr_content
          );
        }
      });
  }

  private showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: this.toastr_destroyByClick,
      duration: this.toastr_duration,
      hasIcon: this.toastr_hasIcon,
      position: this.toastr_position,
      preventDuplicates: this.toastr_preventDuplicates,
    };
    const titleContent = title ? `${title}` : '';
    this.toastrService.show(body, `${titleContent}`, config);
  }
}
