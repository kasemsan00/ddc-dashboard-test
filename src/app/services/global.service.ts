import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  special_line_value = new BehaviorSubject(this.special_line);
  duration_sync_value = new BehaviorSubject(this.duration_sync);
  last_update_value = new BehaviorSubject(this.last_update);
  agent_data_value = new BehaviorSubject(this.agent_data);
  sip_status_value = new BehaviorSubject(this.sip_status);
  branch_name_value = new BehaviorSubject(this.branch_name);

  private subject = new Subject<never>();
  private chart_subject = new Subject<string>();

  set special_line(value: string) {
    this.special_line_value.next(value); // this will make sure to tell every subscriber about the change.
    localStorage.setItem('special_line', value);
  }

  get special_line() {
    return localStorage.getItem('special_line') + '';
  }

  set duration_sync(value: string) {
    this.duration_sync_value.next(value);
    localStorage.setItem('duration_sync', value);
  }

  get duration_sync() {
    return localStorage.getItem('duration_sync') + '';
  }

  set last_update(value) {
    this.last_update_value.next(value);
    localStorage.setItem('last_update', JSON.stringify(value));
  }

  get last_update() {
    return JSON.parse(localStorage.getItem('last_update') + '');
  }

  set agent_data(value) {
    this.agent_data_value.next(value);
    localStorage.setItem('agent_data', JSON.stringify(value));
  }

  get agent_data() {
    return JSON.parse(localStorage.getItem('agent_data') + '');
  }

  set sip_status(value: string) {
    this.sip_status_value.next(value);
    localStorage.setItem('sip_status', value);
  }

  get sip_status() {
    return localStorage.getItem('sip_status') + '';
  }

  set branch_name(value: string) {
    this.branch_name_value.next(value);
    localStorage.setItem('branch_name', value);
  }

  get branch_name() {
    return localStorage.getItem('branch_name') + '';
  }

  setBust(data: never) {
    this.subject.next(data);
  }

  getDataBust(): Observable<never> {
    return this.subject.asObservable();
  }

  setChartData(data: string) {
    this.chart_subject.next(data);
  }

  getChartData(): Observable<string> {
    return this.chart_subject.asObservable();
  }
}
