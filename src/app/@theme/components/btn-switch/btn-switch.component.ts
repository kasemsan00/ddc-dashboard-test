import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'd1442-dashboard-btn-switch',
  templateUrl: './btn-switch.component.html',
  styleUrls: ['./btn-switch.component.scss'],
})
export class BtnSwitchComponent {
  @Input() yesTitle?: string;
  @Input() noTitle?: string;
  @Input() invalid?: boolean = false;
  @Input() disabled?: boolean = false;

  @Input() value?: boolean;
  @Output() valueChange = new EventEmitter<any>();
  constructor() {}

  selectOption(select: boolean) {
    if (this.disabled) return;
    this.value = select;
    this.valueChange.emit(this.value);
  }
}
