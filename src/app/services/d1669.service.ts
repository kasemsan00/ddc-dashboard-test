import { Injectable, NgZone } from '@angular/core';
import { SseService } from './sse.service';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class D1669Service {
  dedicatedWorker: Worker;

  constructor(
    private _zone: NgZone,
    private _sseService: SseService,
    private http: HttpClient,
    private globalService: GlobalService
  ) {
    this.dedicatedWorker = new Worker('../dedicated-worker.worker', {
      type: 'module',
    });

    // @ts-ignore
    this.dedicatedWorker.onmessage = ({ data }: { data: never }) => {
      this.globalService.setBust(data);
    };
  }
  url: any;

  time_of_interval = interval(60000);

  dedicatedWorker_post(url: string) {
    this.dedicatedWorker.postMessage({
      api_sse: url,
    });
  }

  getMapper(url: string) {
    return this.http.get(url);
  }

  getAgentLists(url: string) {
    return this.http.get(url);
  }

  getSIPStatus(url: string) {
    return this.http.get(url);
  }

  getBranch(url: string) {
    return this.http.get(url);
  }

  getConversationChart(url: string) {
    return this.http.get(url);
  }

  getAbandonLists(url: string) {
    return this.http.get(url);
  }
}
