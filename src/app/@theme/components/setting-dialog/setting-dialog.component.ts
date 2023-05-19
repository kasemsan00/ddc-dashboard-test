import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'd1442-dashboard-setting-dialog',
  templateUrl: 'setting-dialog.component.html',
  styleUrls: ['setting-dialog.component.scss'],
})
export class SettingDialogComponent implements OnInit {
  @Input() title = '';

  noti_specail_line: any;
  special_line: any;
  show_cls_noti_btn: boolean = false;

  // @ts-ignore
  form: FormGroup;

  durationSelected: any;
  duration_sync: any = [
    { text: '1 Minute', value: 1 },
    { text: '5 Minutes', value: 5 },
    { text: '10 Minutes', value: 10 },
    { text: '15 Minutes', value: 15 },
    { text: '30 Minutes', value: 30 },
  ];

  chart_format: any;
  abandon_lists_sorting_format: any;
  display_name: any;
  agent_mode: any;
  incoming_label: any;
  answered_label: any;
  abandoned_label: any;

  constructor(
    protected ref: NbDialogRef<SettingDialogComponent>,
    private formBuilder: FormBuilder,
    private globalService: GlobalService
  ) {
    this.createForm();
    this.durationSelected = parseInt(
      localStorage.getItem('duration_sync')!.toString()
    );
  }

  ngOnInit() {
    this.chkNotificationSync();
  }

  dismiss() {
    this.ref.close();
  }

  createForm() {
    this.form = this.formBuilder.group({
      chart_format: [localStorage.getItem('chart_format'), Validators.required],
      abandon_lists_sorting_format: [
        localStorage.getItem('abandon_lists_sorting_format'),
        Validators.required,
      ],
      display_name: [localStorage.getItem('display_name'), Validators.required],
      agent_mode: [localStorage.getItem('agent_mode'), Validators.required],
      incoming_label: [
        localStorage.getItem('incoming_label'),
        Validators.required,
      ],
      answered_label: [
        localStorage.getItem('answered_label'),
        Validators.required,
      ],
      abandoned_label: [
        localStorage.getItem('abandoned_label'),
        Validators.required,
      ],
    });
  }

  selectChartFormatChange(e: Event) {
    this.form.controls['chart_format'].setValue(e ? '24hr' : 'today');
  }

  selectAbandonListsSortingFormatFormatChange(e: Event) {
    this.form.controls['abandon_lists_sorting_format'].setValue(
      e ? 'count' : 'time'
    );
  }

  selectDisplayNameChange(e: Event) {
    this.form.controls['display_name'].setValue(e ? 'name' : 'username');
  }

  selectIncomingChange(e: Event) {
    this.form.controls['incoming_label'].setValue(e ? 'show' : 'hide');
  }

  selectAnsweredChange(e: Event) {
    this.form.controls['answered_label'].setValue(e ? 'show' : 'hide');
  }

  selectAbandonedChange(e: Event) {
    this.form.controls['abandoned_label'].setValue(e ? 'show' : 'hide');
  }

  durationChange(e: Event) {
    this.durationSelected = e;
  }

  saveSetting() {
    this.chart_format = this.form.get('chart_format')?.value;
    this.abandon_lists_sorting_format = this.form.get(
      'abandon_lists_sorting_format'
    )?.value;
    this.display_name = this.form.get('display_name')?.value;
    this.agent_mode = this.form.get('agent_mode')?.value;
    this.incoming_label = this.form.get('incoming_label')?.value;
    this.answered_label = this.form.get('answered_label')?.value;
    this.abandoned_label = this.form.get('abandoned_label')?.value;

    localStorage.setItem('chart_format', this.chart_format); // 24hr, today
    localStorage.setItem(
      'abandon_lists_sorting_format',
      this.abandon_lists_sorting_format
    ); // count, time
    localStorage.setItem('display_name', this.display_name); // username, name
    localStorage.setItem('agent_mode', this.agent_mode); // normal, backup
    localStorage.setItem('incoming_label', this.incoming_label); // show, hide
    localStorage.setItem('answered_label', this.answered_label); // show, hide
    localStorage.setItem('abandoned_label', this.abandoned_label); // show, hide

    this.globalService.duration_sync = JSON.stringify(this.durationSelected);

    this.ref.close(this.chart_format);
  }

  chkNotificationSync() {
    this.globalService.special_line_value.subscribe((nextValue) => {
      this.noti_specail_line = JSON.parse(nextValue);
      if (
        this.noti_specail_line.s_ttrs.value != 0 ||
        this.noti_specail_line.s_191.value != 0 ||
        this.noti_specail_line.s_cellular.value != 0 ||
        this.noti_specail_line.s_data.value != 0 ||
        this.noti_specail_line.s_operator.value != 0
      ) {
        this.show_cls_noti_btn = true;
      }
    });
  }

  clearNoti() {
    this.special_line = {
      s_ttrs: { value: 0, type: '' },
      s_191: { value: 0, type: '' },
      s_cellular: { value: 0, type: '' },
      s_data: { value: 0, type: '' },
      s_operator: { value: 0, type: '' },
    };
    this.globalService.special_line = JSON.stringify(this.special_line);
    this.dismiss();
  }
}
