import { Component, HostListener } from '@angular/core';
import {
  NbIconLibraries,
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrService,
  NbToastrConfig,
} from '@nebular/theme';
import { timer } from 'rxjs';
import { D1669Service } from '../../../services/d1669.service';
import { environment } from '../../../../environments/environment';
import * as screenfull from 'screenfull';
import { AuthService } from '../../../services/auth.service';
import { NbDialogService, NbToastRef } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, forkJoin, Subscription } from 'rxjs';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'd1442-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  // templateUrl: './dashboard.component.html',
  template: `<div></div>`,
})
export class DashboardComponent {
  is_fullscreen = false;

  tmp_summary_id: Array<never> = [];

  noti_specail_line: any;

  user: any;
  url_mapper: any;
  agent_lists: any;

  dashboard_name: any = 'Dashboard d1669 Bangkok';
  dashboard_datetime: any = ''; // '22 February 2020 | 16:33:45'

  duration_sync: any;

  province_id: any;

  agents: any = [];

  setting: any = {
    chart_format: '24hr',
    abandon_lists_sorting_format: 'count',
    display_name: 'name',
    agent_mode: 'normal',
  };

  setting_mapper: any = {
    '24hr': 'Last 24 Hours',
    today: 'Today',
  };

  agent_type_id: any = {
    '6': 'Call Taker and Non Emergency Swarm',
    '7': 'Coordinator and Dispatcher Swarm',
  };

  trigger: any = true;

  agents_call_taker: any = [];
  agents_dispatcher: any = [];
  agents_supervisor: any = [];
  agents_coordinator: any = [];
  agents_non_emergency: any = [];
  agents_backup: any = [];
  agents_data_count: any = {
    agent_mode: '',
    agent_normal: 0,
    agent_backup: 0,
  };

  display_calltime: any;
  display_calltime_call_taker: any = [];
  display_calltime_dispatcher: any = [];
  display_calltime_supervisor: any = [];
  display_calltime_coordinator: any = [];
  display_calltime_non_emergency: any = [];
  display_calltime_backup: any = [];

  special_line: any = {
    s_ttrs: { value: 0, type: '' },
    s_191: { value: 0, type: '' },
    s_cellular: { value: 0, type: '' },
    s_data: { value: 0, type: '' },
    s_operator: { value: 0, type: '' },
  };

  abandon_lists: any = [];
  conversations_amount: any;
  conversations_time: any;

  conversation_amount = [
    {
      id: 'incoming',
      title: 'Incoming Calls',
      value: 0,
      color: 'info',
      format: 'status',
    },
    {
      id: 'answer',
      title: 'Answered Calls',
      value: 0,
      color: 'success',
      format: 'status',
    },
    {
      id: 'abandon',
      title: 'Abandoned Calls',
      value: 0,
      color: 'danger',
      format: 'status',
    },
    {
      id: 'percent_sla',
      title: 'SLA (%)',
      value: 98,
      color: 'success',
      format: 'outline',
    },
  ];

  conversation_time = [
    {
      id: 'avg_service',
      title: 'AVG Talk Time',
      value: '00:00:00',
      color: 'info',
      format: 'outline',
    },
    {
      id: 'longest_service',
      title: 'Longest Talk Time',
      value: '00:00:00',
      color: 'info',
      format: 'outline',
    },
  ];

  agent_status_text: any = {
    online: 'Online',
    ringing: 'Ringing',
    busy: 'Talking',
    dnd_short: 'DND',
    dnd_long: 'DND',
    offline: 'Offline',
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

  config: NbToastrConfig | boolean = false;

  chart_interval = interval(1000 * 60);
  statisticSubscription: any;

  data_chart: any | string;

  evaIcons: string[] = [];
  interval: any;
  time = 0;

  subscriptions_sync: Subscription = Subscription.EMPTY;
  subscriptions_sse: Subscription = Subscription.EMPTY;
  subscriptions_forkjoin: Subscription = Subscription.EMPTY;

  special_line_ttrs: NbToastRef = this.toastrService.show({});
  special_line_191: NbToastRef = this.toastrService.show({});
  special_line_cellular: NbToastRef = this.toastrService.show({});
  special_line_data: NbToastRef = this.toastrService.show({});
  special_line_operator: NbToastRef = this.toastrService.show({});

  public now: Date = new Date();

  url_mode: any = 'mapper'; // url_mapper, url_fixed
  branch_id: any;
  branch_name: any;

  constructor(
    iconsLibrary: NbIconLibraries,
    private _d1669Service: D1669Service,
    private auth: AuthService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router,
    private globalService: GlobalService,
    private route: ActivatedRoute
  ) {
    this.evaIcons = Array.from(iconsLibrary.getPack('eva').icons.keys()).filter(
      (icon) => icon.indexOf('outline') === -1
    );

    iconsLibrary.registerFontPack('fa', {
      packClass: 'fa',
      iconClassPrefix: 'fa',
    });
    iconsLibrary.registerFontPack('far', {
      packClass: 'far',
      iconClassPrefix: 'fa',
    });
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });

    this.interval;
  }

  ngOnInit() {
    this.checkMode();
    this.initSetting();
    this.fetchUserMapper();
    this.fetchURLMapper();
    // this.initNotification()
    this.chkNotificationSync();
  }

  ngOnDestroy() {
    if (this.statisticSubscription && !this.statisticSubscription.closed)
      this.statisticSubscription.unsubscribe();
  }

  checkMode() {
    this.route.params.subscribe((params: any) => {
      const branch_id = params.branch_id;
      if (branch_id) {
        this.url_mode = 'fixed';
        this.branch_id = branch_id;
        this.getBranchName(this.branch_id);
      } else {
        this.url_mode = 'mapper';
        this.globalService.branch_name = '';
      }
    });
  }

  getBranchName(branch_id: string) {
    console.log('branch_id', branch_id);
    this.globalService.branch_name = '';
    this._d1669Service
      .getBranch(
        environment.environment.url_backend +
          '/mapper-agent/v1/branchs?limit=100'
      )
      .subscribe((data: any) => {
        if (data['status'] == 'OK') {
          data['data']['data'].map((item: any) => {
            if (item.branch_id == branch_id) {
              console.log('branch_name1', item.branch_name);
              this.globalService.branch_name = item.branch_name;
              return;
            }
          });
        }
        // this.globalService.branch_name = 'UNKNOW'
        return;
      });
  }

  initSetting() {
    const chart_format: string | undefined = localStorage
      .getItem('chart_format')
      ?.toString();
    const abandon_lists_sorting_format: string | undefined = localStorage
      .getItem('abandon_lists_sorting_format')
      ?.toString();
    const display_name = localStorage.getItem('display_name');
    const agent_mode = localStorage.getItem('agent_mode');
    if (chart_format) {
      this.setting.chart_format = chart_format;
      localStorage.setItem('chart_format', chart_format);
    } else {
      localStorage.setItem('chart_format', this.setting.chart_format);
    }
    if (abandon_lists_sorting_format) {
      this.setting.abandon_lists_sorting_format = abandon_lists_sorting_format;
      localStorage.setItem(
        'abandon_lists_sorting_format',
        abandon_lists_sorting_format
      );
    } else {
      localStorage.setItem(
        'abandon_lists_sorting_format',
        this.setting.abandon_lists_sorting_format
      );
    }
    if (display_name) {
      this.setting.display_name = display_name;
      localStorage.setItem('display_name', display_name);
    } else {
      localStorage.setItem('display_name', this.setting.display_name);
    }
    if (agent_mode) {
      this.setting.agent_mode = agent_mode;
      localStorage.setItem('agent_mode', agent_mode);
    } else {
      localStorage.setItem('agent_mode', this.setting.agent_mode);
    }
  }

  initDashboard() {
    this.display_realtime_date();
    this.fetchAgents();
    // console.log(this.evaIcons)
    this.fetchConversationSummary();
    this.fetchAbandonLists();
    this.fetchDataSSE();
    this.fetchSIPStatus();
    this.checkCallStatus();
    this.globalService.last_update = Date.now();
  }

  initNotification() {
    this.globalService.special_line = JSON.stringify(this.special_line);
  }

  fetchAPIs() {
    // this.fetchAgents()
    this.fetchConversationSummary();
    this.fetchAbandonLists();
    this.fetchSIPStatus();
    this.tmp_summary_id = [];
  }

  fetchURLMapper() {
    this._d1669Service
      .getMapper(
        environment.environment.url_mapper +
          '/' +
          this.user.preferred_username +
          '/services/dashboard?network_policy=' +
          environment.environment.network_policy
      )
      .subscribe((data: any) => {
        if (data['status'] == 'OK') {
          this.url_mapper = data['data'].api_url;
          let url_api_sse = '';
          if (this.url_mode == 'mapper') {
            url_api_sse = this.url_mapper.api_sse;
            this.branch_id = data['data'].branch_id;
          } else {
            url_api_sse =
              environment.environment.url_backend +
              '/sse/v1/' +
              this.branch_id +
              '/event';
          }
          this.getBranchName(this.branch_id);
          localStorage.setItem('url_mapper', JSON.stringify(this.url_mapper));
          this._d1669Service.dedicatedWorker_post(url_api_sse);
          // if (data["data"].branch_id == "") {
          //   if (this.user.roles.indexOf('admin') > -1) {
          //     this.showToast('warning', 'Admin function is coming soon.', '');
          //   } else {
          //     this.showToast('warning', 'ไม่มีสิทธิ์ใช้งานระบบ!', '');
          //     this.router.navigate(['/pages/miscellaneous/403']);
          //   }
          // } else {
          //   this.initDashboard()
          //   this.checkDurationSync()
          // }
          this.initDashboard();
          this.checkDurationSync();
        } else {
          this.router.navigate(['/pages/miscellaneous/403', { system: 'CIS' }]);
        }
      });
  }

  fetchSIPStatus() {
    let url_api_status = '';
    if (this.url_mode == 'mapper') {
      url_api_status = this.url_mapper.api_status;
    } else {
      url_api_status =
        environment.environment.url_backend +
        '/sse/v1/' +
        this.branch_id +
        '/status';
    }
    this._d1669Service
      .getSIPStatus(url_api_status + '/' + this.setting.chart_format)
      .subscribe((data: any) => {
        if (data['status'] == 'OK') {
          this.globalService.sip_status = data['data']['status'];
        } else {
          this.globalService.sip_status = 'N/A';
        }
      });
  }

  fetchAgents() {
    this.subscriptions_forkjoin = forkJoin({
      // agent_status: this._d1669Service.getAgentStatus(url_api_agent_status),
      // agent_lists: this._d1669Service.getAgentLists(url_api_agent),
    }).subscribe(
      ({
        agent_status,
        agent_lists,
      }: {
        agent_status: any;
        agent_lists: any;
      }) => {
        if (agent_lists['data'] && this.agent_lists['data'].length > 0) {
          this.agent_lists = agent_lists['data'];
        }
        if (agent_status['data'] && agent_status['data'].length > 0) {
          this.agents = agent_status['data'];
          this.mapDisplayNameAgents();
          this.filterAgentByType();
        }
        this.countAgentSystem();
      }
    );
  }

  countAgentSystem() {
    const agent_normal_system = this.agents.filter(
      (x: any) => x.agent_type_id <= 5
    ).length;
    const agent_backup_system = this.agents.filter(
      (x: any) => x.agent_type_id == 8
    ).length;
    const data = {
      agent_mode: localStorage.getItem('agent_mode') || 'normal',
      agent_normal: agent_normal_system,
      agent_backup: agent_backup_system,
    };
    this.globalService.agent_data = data;
    this.agents_data_count = data;
  }

  mapDisplayNameAgents() {
    this.agents.map((item: any) => {
      if (item.source == item.destination) {
        // fix for show as Busy
        item.action_at = 0;
      }

      if (this.agent_lists.length > 0) {
        this.agent_lists.map((item_list: any) => {
          // map display name
          if (
            item.agent_username == item_list.username &&
            item.name == undefined
          ) {
            item.name = item_list.name;
            item.last_name = item_list.last_name;
          }
        });
      }
    });
  }

  fetchDataSSE() {
    if (this.subscriptions_sse) {
      this.subscriptions_sse.unsubscribe();
    }
    this.subscriptions_sse = this.globalService
      .getDataBust()
      .subscribe((data: any) => {
        const dataAgents = data;

        // check initial, is a first connection
        if (dataAgents.title == 'initial') {
          if (environment.environment.env_mode != 'production')
            console.log('SSE:', dataAgents.status);

          if (dataAgents.body === null) {
            this.agents = [];
          } else {
            this.agents = dataAgents.body;
            this.agents = this.agents.map((item: any) => {
              if (item.source == item.destination) {
                // fix for show as Busy
                item.action_at = 0;
              }
              return item;
            });
          }
          this.mapDisplayNameAgents();
          this.filterAgentByType();
          this.countAgentSystem();
          return;
        }

        // check trigger, support agent login, logout and change position
        if (dataAgents.title == 'trigger') {
          if (environment.environment.env_mode != 'production') {
            console.log('SSE:', dataAgents.title);
            console.log('Change position');
            console.log(dataAgents.body);
          }

          if (dataAgents.body === null) {
            this.agents = [];
          } else {
            this.agents = dataAgents.body;
            this.agents = this.agents.map((item: any) => {
              if (item.source == item.destination) {
                // fix for show as Busy
                item.action_at = 0;
              }
              return item;
            });
          }
          this.mapDisplayNameAgents();
          this.filterAgentByType();
          this.countAgentSystem();
          return;
        }

        // check SIP status
        if (dataAgents.title == 'sip') {
          if (dataAgents.body['status']) {
            this.globalService.sip_status = dataAgents.body['status'];
          } else {
            this.globalService.sip_status = 'N/A';
          }
          return;
        }

        if (environment.environment.env_mode != 'production')
          console.log('dataAgents', dataAgents);

        // ******************** Start event without agent ********************

        // if (dataAgents.body.action == "ANSWER") {
        //   // check for close special line notify
        //   if (dataAgents.body.source_type == "TTRS") {
        //     if (this.special_line.s_ttrs.value > 0) {
        //       this.special_line.s_ttrs.value--
        //       if (this.special_line.s_ttrs.value < 0) this.special_line.s_ttrs.value = 0
        //       this.globalService.special_line = JSON.stringify(this.special_line)
        //     }
        //   }
        //   if (dataAgents.body.source_type == "191") {
        //     if (this.special_line.s_191.value > 0) {
        //       this.special_line.s_191.value--
        //       if (this.special_line.s_191.value < 0) this.special_line.s_191.value = 0
        //       this.globalService.special_line = JSON.stringify(this.special_line)
        //     }
        //   }
        // }

        // manage "Call Taker and Non Emergency Swarm" & "Coordinator and Dispatcher Swarm"
        if (
          dataAgents.body.agent_type_id == '6' ||
          dataAgents.body.agent_type_id == '7'
        ) {
          // swarm
          if (environment.environment.env_mode != 'production')
            console.log(
              dataAgents.body.agent_type,
              dataAgents.body.source_type
            );
          if (
            dataAgents.body.action == 'QUEUE_FULL_ANOTHER' ||
            dataAgents.body.action == 'RINGING'
          ) {
            if (dataAgents.body.source_type == 'Cellular') {
              this.special_line.s_cellular.value++;
              this.special_line.s_cellular.type = dataAgents.body.agent_type_id;
              this.globalService.special_line = JSON.stringify(
                this.special_line
              );
              return;
            }
            if (dataAgents.body.source_type == 'Data') {
              this.special_line.s_data.value++;
              this.special_line.s_data.type = dataAgents.body.agent_type_id;
              this.globalService.special_line = JSON.stringify(
                this.special_line
              );
              return;
            }
            if (dataAgents.body.source_type == 'TTRS') {
              this.special_line.s_ttrs.value++;
              this.special_line.s_ttrs.type = dataAgents.body.agent_type_id;
              this.globalService.special_line = JSON.stringify(
                this.special_line
              );
              return;
            }
            if (dataAgents.body.source_type == '191') {
              this.special_line.s_191.value++;
              this.special_line.s_191.type = dataAgents.body.agent_type_id;
              this.globalService.special_line = JSON.stringify(
                this.special_line
              );
              return;
            }
            if (dataAgents.body.source_type == 'Operator') {
              this.special_line.s_operator.value++;
              this.special_line.s_operator.type = dataAgents.body.agent_type_id;
              this.globalService.special_line = JSON.stringify(
                this.special_line
              );
              return;
            }
          }

          if (
            [
              'NO_ANSWER',
              'ANSWER',
              'ANSWER_ANOTHER',
              'QUEUE_FULL_ANOTHER_ABANDON',
            ].indexOf(dataAgents.body.action) > -1
          ) {
            if (dataAgents.body.source_type == 'Cellular') {
              if (this.special_line.s_cellular.value > 0) {
                this.special_line.s_cellular.value--;
                this.special_line.s_cellular.type =
                  dataAgents.body.agent_type_id;
                this.globalService.special_line = JSON.stringify(
                  this.special_line
                );
                return;
              }
            }
            if (dataAgents.body.source_type == 'Data') {
              if (this.special_line.s_data.value > 0) {
                this.special_line.s_data.value--;
                this.special_line.s_data.type = dataAgents.body.agent_type_id;
                this.globalService.special_line = JSON.stringify(
                  this.special_line
                );
                return;
              }
            }
            if (dataAgents.body.source_type == 'TTRS') {
              if (this.special_line.s_ttrs.value > 0) {
                this.special_line.s_ttrs.value--;
                this.special_line.s_ttrs.type = dataAgents.body.agent_type_id;
                this.globalService.special_line = JSON.stringify(
                  this.special_line
                );
                return;
              }
            }
            if (dataAgents.body.source_type == '191') {
              if (this.special_line.s_191.value > 0) {
                this.special_line.s_191.value--;
                this.special_line.s_191.type = dataAgents.body.agent_type_id;
                this.globalService.special_line = JSON.stringify(
                  this.special_line
                );
                return;
              }
            }
            if (dataAgents.body.source_type == 'Operator') {
              if (this.special_line.s_operator.value > 0) {
                this.special_line.s_operator.value--;
                this.special_line.s_operator.type =
                  dataAgents.body.agent_type_id;
                this.globalService.special_line = JSON.stringify(
                  this.special_line
                );
                return;
              }
            }
          }

          // if (dataAgents.body.action == "QUEUE_FULL_ANOTHER_ABANDON") {
          //   this.updateStatistic(dataAgents.body)
          //   if (dataAgents.body.source_type == "TTRS") {
          //     this.special_line.s_ttrs.value--
          //     if (this.special_line.s_ttrs.value < 0) this.special_line.s_ttrs.value = 0
          //     this.globalService.special_line = JSON.stringify(this.special_line)
          //   }
          //   if (dataAgents.body.source_type == "191") {
          //     this.special_line.s_191.value--
          //     if (this.special_line.s_191.value < 0) this.special_line.s_191.value = 0
          //     this.globalService.special_line = JSON.stringify(this.special_line)
          //   }
          //   return
          // }
        }

        if (dataAgents.body.action == 'QUEUE_FULL_ABANDON') {
          this.updateStatistic(dataAgents.body);
          return;
        }
        // ******************** End event without agent ********************

        // ******************** Start event about agent busy ********************
        // replace dnd status & switch all busy every this agent
        if (
          dataAgents.body.action.includes('DND') ||
          dataAgents.body.action == 'ANSWER' ||
          dataAgents.body.action == 'HANGUP' ||
          dataAgents.body.action == 'ABANDON' ||
          dataAgents.body.action == 'NO_ANSWER'
        ) {
          this.agents.map((item: any) => {
            if (item.agent_extension == dataAgents.body.agent_extension)
              item.action = dataAgents.body.action;
            return item;
          });
        }
        // ******************** End event about agent busy ********************

        // ******************** Start event with agent ********************

        for (let i = 0; i < this.agents.length; i++) {
          // This event matches an agent.
          if (
            this.agents[i].agent_extension == dataAgents.body.agent_extension &&
            this.agents[i].agent_type == dataAgents.body.agent_type
          ) {
            // this agent receive event about timimg
            if (
              dataAgents.body.action == 'RINGING' ||
              dataAgents.body.action == 'ANSWER' ||
              dataAgents.body.action == 'TRANSFER_JOIN_CALLING'
            ) {
              if (dataAgents.body.source == dataAgents.body.destination) {
                // fix for show as Busy
                dataAgents.body.action_at = 0;
              }
              // dataAgents.body.source = dataAgents.body.a_number
              // switch source <=> destination when outbound
              if (dataAgents.body.bound_type == 'outbound') {
                const tmp = dataAgents.body.source;
                dataAgents.body.source = dataAgents.body.a_number;
                dataAgents.body.destination = tmp;
              }
              // repeace data to this agent
              this.agents[i] = dataAgents.body;
              if (dataAgents.body.action == 'TRANSFER_JOIN_CALLING') {
                // Continuous timing
                const tmp_action_at = this.agents[i].action_at;
                this.agents[i] = dataAgents.body;
                this.agents[i].action_at = tmp_action_at;
                break;
              }
              if (dataAgents.body.action == 'RINGING') {
                // update statistic only inbound
                if (dataAgents.body.bound_type == 'inbound') {
                  this.updateStatistic(dataAgents.body);
                }
                break;
              }
              if (dataAgents.body.action == 'ANSWER') {
                // update statistic only inbound
                if (dataAgents.body.bound_type == 'inbound') {
                  this.updateStatistic(dataAgents.body);
                }
                // check for close special line notify
                if (dataAgents.body.source_type == 'TTRS') {
                  if (this.special_line.s_ttrs.value > 0) {
                    this.special_line.s_ttrs.value--;
                    if (this.special_line.s_ttrs.value < 0)
                      this.special_line.s_ttrs.value = 0;
                    this.globalService.special_line = JSON.stringify(
                      this.special_line
                    );
                  }
                }
                if (dataAgents.body.source_type == '191') {
                  if (this.special_line.s_191.value > 0) {
                    this.special_line.s_191.value--;
                    if (this.special_line.s_191.value < 0)
                      this.special_line.s_191.value = 0;
                    this.globalService.special_line = JSON.stringify(
                      this.special_line
                    );
                  }
                }
                break;
              }
            }

            // this agent is end conversation
            if (
              dataAgents.body.action == 'HANGUP' ||
              dataAgents.body.action == 'ABANDON' ||
              dataAgents.body.action == 'NO_ANSWER' ||
              dataAgents.body.action == 'CANCEL_TRANSFER'
            ) {
              this.agents[i] = dataAgents.body;
              if (environment.environment.env_mode != 'production')
                console.log('End conversation', dataAgents.body.action);
              this.updateStatistic(dataAgents.body);
              this.agents[i].action = 'DND_OFF';
              break;
            }

            // this agent is transfer
            if (
              dataAgents.body.action == 'TRANSFER' &&
              dataAgents.body.action_by == this.agents[i].agent_extension
            ) {
              console.log(
                'agent ' +
                  this.agents[i].agent_extension +
                  ' (' +
                  this.agents[i].agent_type +
                  ') is transfered'
              );
              // Continuous timing & keep source
              const tmp_action_at = this.agents[i].action_at;
              const tmp_source_type = this.agents[i].source_type;
              this.agents[i] = dataAgents.body;
              this.agents[i].action_at = tmp_action_at;
              this.agents[i].source_type = tmp_source_type;
              this.agents[i].source = this.agents[i].a_number;
              break;
            }

            // this agent is transfer
            if (dataAgents.body.action == 'LOST_TRANSFER') {
              console.log(
                'agent ' +
                  this.agents[i].agent_extension +
                  ' (' +
                  this.agents[i].agent_type +
                  ') is lost transfered'
              );
              // Continuous timing & keep source
              const tmp_action_at = this.agents[i].action_at;
              const tmp_source_type = this.agents[i].source_type;
              this.agents[i] = dataAgents.body;
              this.agents[i].action_at = tmp_action_at;
              this.agents[i].source_type = tmp_source_type;
              this.agents[i].source = this.agents[i].a_number;
              break;
            }

            // this agent join conference
            if (
              dataAgents.body.action == 'JOIN_CONFERENCE' &&
              dataAgents.body.action_by == this.agents[i].agent_extension
            ) {
              if (environment.environment.env_mode != 'production')
                console.log(
                  'agent ' +
                    this.agents[i].agent_extension +
                    ' (' +
                    this.agents[i].agent_type +
                    ') joined conference'
                );
              // Continuous timing
              const tmp_action_at = this.agents[i].action_at;
              this.agents[i] = dataAgents.body;
              this.agents[i].action_at = tmp_action_at;
              this.agents[i].source = this.agents[i].a_number;
              if (environment.environment.env_mode != 'production')
                console.log('action_at', this.agents[i].action_at);
              break;
            }

            // this agent leave conference
            if (
              dataAgents.body.action == 'LEAVE_CONFERENCE' &&
              dataAgents.body.action_by === this.agents[i].agent_extension
            ) {
              if (environment.environment.env_mode != 'production')
                console.log(
                  'agent ' +
                    this.agents[i].agent_extension +
                    '  leaved conference'
                );
              this.agents[i] = dataAgents.body;
              this.agents[i].action = 'DND_OFF';
              this.agents[i].source = this.agents[i].a_number;
              break;
            }
          }
        }
        // ******************** End event with agent ********************
        this.mapDisplayNameAgents();
        this.filterAgentByType();
      });
  }

  checkDurationSync() {
    this.globalService.duration_sync_value.subscribe((nextValue) => {
      const period = () => parseInt(nextValue);
      if (environment.environment.env_mode != 'production') {
        console.log('period update', period());
        console.log('nextValue', nextValue);
      }

      if (isNaN(period())) {
        if (environment.environment.env_mode != 'production')
          console.log('updated');
        this.globalService.duration_sync = '5';
      } else {
        this.initSetting();
        this.initDashboard();

        if (this.subscriptions_sync) this.subscriptions_sync.unsubscribe();

        this.subscriptions_sync = interval(
          parseInt(nextValue) * 1000 * 60
        ).subscribe((val) => {
          this.fetchAPIs();
          this.globalService.duration_sync = nextValue;
        });
      }
    });
  }

  chkNotificationSync() {
    this.globalService.special_line_value.subscribe((nextValue) => {
      this.noti_specail_line = JSON.parse(nextValue);
      // console.log(this.noti_specail_line)
      // set default if not exist
      if (!this.noti_specail_line) {
        // this.special_line = { s_ttrs: 0, s_191: 0, s_cellular: 0, s_data: 0, s_operator: 0 }
        this.special_line = {
          s_ttrs: { value: 0, type: '' },
          s_191: { value: 0, type: '' },
          s_cellular: { value: 0, type: '' },
          s_data: { value: 0, type: '' },
          s_operator: { value: 0, type: '' },
        };
        this.globalService.special_line = JSON.stringify(this.special_line);
      }
      // show/hide notification alert
      if (this.noti_specail_line.s_ttrs.value > 0) {
        if (this.special_line_ttrs) this.special_line_ttrs.close();
        this.showToastCall(
          this.noti_specail_line.s_ttrs.type == '6' ? 'warning' : 'danger',
          'Incoming call from TTRS (' +
            this.noti_specail_line.s_ttrs.value +
            ')',
          '',
          'TTRS'
        );
      }
      if (this.noti_specail_line.s_ttrs.value <= 0) {
        if (this.special_line_ttrs) this.special_line_ttrs.close();
      }
      if (this.noti_specail_line.s_191.value > 0) {
        if (this.special_line_191) this.special_line_191.close();
        this.showToastCall(
          this.noti_specail_line.s_191.type == '6' ? 'warning' : 'danger',
          'Incoming call from 191 (' + this.noti_specail_line.s_191.value + ')',
          '',
          '191'
        );
      }
      if (this.noti_specail_line.s_191.value <= 0) {
        if (this.special_line_191) this.special_line_191.close();
      }
      if (this.noti_specail_line.s_cellular.value > 0) {
        if (this.special_line_cellular) this.special_line_cellular.close();
        this.showToastCall(
          this.noti_specail_line.s_cellular.type == '6' ? 'warning' : 'danger',
          'Incoming call from Cellular (' +
            this.noti_specail_line.s_cellular.value +
            ')',
          '',
          'Cellular'
        );
      }
      if (this.noti_specail_line.s_cellular.value <= 0) {
        if (this.special_line_cellular) this.special_line_cellular.close();
      }
      if (this.noti_specail_line.s_data.value > 0) {
        if (this.special_line_data) this.special_line_data.close();
        this.showToastCall(
          this.noti_specail_line.s_data.type == '6' ? 'warning' : 'danger',
          'Incoming call from Data (' +
            this.noti_specail_line.s_data.value +
            ')',
          '',
          'Data'
        );
      }
      if (this.noti_specail_line.s_data.value <= 0) {
        if (this.special_line_data) this.special_line_data.close();
      }
      if (this.noti_specail_line.s_operator.value > 0) {
        if (this.special_line_operator) this.special_line_operator.close();
        this.showToastCall(
          this.noti_specail_line.s_operator.type == '6' ? 'warning' : 'danger',
          'Incoming call from Operator (' +
            this.noti_specail_line.s_operator.value +
            ')',
          '',
          'Operator'
        );
      }
      if (this.noti_specail_line.s_operator.value <= 0) {
        if (this.special_line_operator) this.special_line_operator.close();
      }
    });
  }

  filterAgentByType() {
    this.agents_call_taker = this.agents.filter(
      (x: any) => x.agent_type == 'Call Taker'
    );
    this.agents_dispatcher = this.agents.filter(
      (x: any) => x.agent_type == 'Dispatcher'
    );
    this.agents_supervisor = this.agents.filter(
      (x: any) => x.agent_type == 'Supervisor'
    );
    this.agents_coordinator = this.agents.filter(
      (x: any) => x.agent_type == 'Coordinator'
    );
    this.agents_non_emergency = this.agents.filter(
      (x: any) => x.agent_type == 'Non Emergency'
    );
    this.agents_backup = this.agents.filter(
      (x: any) => x.agent_type == 'Tablet'
    );
  }

  fetchConversationSummary() {
    let url_api_summary = '';
    if (this.url_mode == 'mapper') {
      url_api_summary = this.url_mapper.api_summary;
    } else {
      url_api_summary =
        environment.environment.url_backend +
        '/sse/v1/' +
        this.branch_id +
        '/summary';
    }
    this._d1669Service
      .getConversationChart(url_api_summary + '/' + this.setting.chart_format)
      .subscribe((data: any) => {
        if (data['status'] === 'OK') {
          // summary
          // assign value
          this.conversation_amount = this.conversation_amount.map((x: any) => {
            if (x.id in data['data'].summary) {
              x.value = data['data'].summary[x.id];
              return x;
            }
          });
          this.conversation_time = this.conversation_time.map((x: any) => {
            if (x.id in data['data'].summary) {
              x.value = this.secToTime(data['data'].summary[x.id]);
              return x;
            }
          });
          this.conversations_amount = this.conversation_amount;
          this.conversations_time = this.conversation_time;

          // chart
          if (this.data_chart !== data['data'].detail) {
            this.data_chart = data['data'].detail;
            this.globalService.setChartData(JSON.stringify(this.data_chart));
          }
        }
      });
  }

  fetchAbandonLists() {
    let url_api_abandonlist = '';
    if (this.url_mode == 'mapper') {
      url_api_abandonlist = this.url_mapper.api_abandonlist;
    } else {
      url_api_abandonlist =
        environment.environment.url_backend +
        '/sse/v1/' +
        this.branch_id +
        '/abandon';
    }
    this._d1669Service
      .getAbandonLists(url_api_abandonlist + '/' + this.setting.chart_format)
      .subscribe((data: any) => {
        if (data['data']) {
          this.abandon_lists = data['data'];
          this.abandon_lists = this.sortAbandon(this.abandon_lists);
          this.abandon_lists = this.abandon_lists.slice(0, 8);
        } else {
          this.abandon_lists = [];
        }
      });
  }

  sortAbandon(abandon_lists: any) {
    if (localStorage.getItem('abandon_lists_sorting_format') == 'count') {
      abandon_lists = abandon_lists.sort(this.sortAbandonByCount);
    } else {
      abandon_lists = abandon_lists.sort(this.sortAbandonByTime);
    }
    return abandon_lists;
  }

  sortAbandonByCount(x: any, y: any) {
    const n = y.amount - x.amount;
    if (n != 0) {
      return n;
    }
    return y.lastest_at - x.lastest_at;
  }

  sortAbandonByTime(x: any, y: any) {
    const n = y.lastest_at - x.lastest_at;
    if (n != 0) {
      return n;
    }
    return y.amount - x.amount;
  }

  fetchUserMapper() {
    this.user = this.auth.getIdentityClaims();
  }

  secToTime(sec: any) {
    const sec_num = parseInt(sec, 10); // don't forget the second param
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor((sec_num - hours * 3600) / 60);
    const seconds = sec_num - hours * 3600 - minutes * 60;
    let tmp_hours, tmp_minutes, tmp_seconds;

    if (hours < 10) {
      tmp_hours = '0' + hours;
    } else tmp_hours = hours;
    if (minutes < 10) {
      tmp_minutes = '0' + minutes;
    } else tmp_minutes = minutes;
    if (seconds < 10) {
      tmp_seconds = '0' + seconds;
    } else tmp_seconds = seconds;
    return tmp_hours + ':' + tmp_minutes + ':' + tmp_seconds;
  }

  display_realtime_date() {
    const delay = 1000; // every 1 sec
    timer(delay, 1000).subscribe((x) => {
      this.dashboard_datetime = new Date();
    });
  }

  checkCallStatus() {
    const delay = 1000; // every 1 sec
    timer(delay, 1000).subscribe((x) => {
      // console.log(this.display_calltime_call_taker)
      for (let i = 0; i < this.agents_call_taker.length; i++) {
        this.setDisplayCallTime(this.agents_call_taker[i], i, 'CT');
      }
      for (let i = 0; i < this.agents_non_emergency.length; i++) {
        this.setDisplayCallTime(this.agents_non_emergency[i], i, 'NE');
      }
      for (let i = 0; i < this.agents_coordinator.length; i++) {
        this.setDisplayCallTime(this.agents_coordinator[i], i, 'CO');
      }
      for (let i = 0; i < this.agents_dispatcher.length; i++) {
        this.setDisplayCallTime(this.agents_dispatcher[i], i, 'DP');
      }
      for (let i = 0; i < this.agents_supervisor.length; i++) {
        this.setDisplayCallTime(this.agents_supervisor[i], i, 'SU');
      }
      for (let i = 0; i < this.agents_backup.length; i++) {
        this.setDisplayCallTime(this.agents_backup[i], i, 'Backup');
      }
    });
  }

  setDisplayCallTime(agent: any, index: any, calltime_type: any) {
    if (
      agent.action == 'ANSWER' ||
      agent.action == 'RINGING' ||
      agent.action == 'TRANSFER' ||
      agent.action == 'LOST_TRANSFER' ||
      (agent.action && agent.action.includes('CONFERENCE')) ||
      agent.action == 'TRANSFER_JOIN_CALLING'
    ) {
      if (agent.action_at == 0) {
        if (calltime_type == 'CT') this.display_calltime_call_taker[index] = '';
        if (calltime_type == 'NE')
          this.display_calltime_non_emergency[index] = '';
        if (calltime_type == 'CO')
          this.display_calltime_coordinator[index] = '';
        if (calltime_type == 'DP') this.display_calltime_dispatcher[index] = '';
        if (calltime_type == 'SU') this.display_calltime_supervisor[index] = '';
        if (calltime_type == 'Backup') this.display_calltime_backup[index] = '';
      } else {
        const counter = new Date(0, 0, 0, 0, 0, 0);
        const start_time = agent.action_at;
        let talk_time = Math.floor(Date.now() / 1000 - start_time);
        if (talk_time < 0) talk_time = 0;
        counter.setSeconds(talk_time);
        if (calltime_type == 'CT')
          this.display_calltime_call_taker[index] = counter;
        if (calltime_type == 'NE')
          this.display_calltime_non_emergency[index] = counter;
        if (calltime_type == 'CO')
          this.display_calltime_coordinator[index] = counter;
        if (calltime_type == 'DP')
          this.display_calltime_dispatcher[index] = counter;
        if (calltime_type == 'SU')
          this.display_calltime_supervisor[index] = counter;
        if (calltime_type == 'Backup')
          this.display_calltime_backup[index] = counter;
      }
    } else {
      if (calltime_type == 'CT') this.display_calltime_call_taker[index] = '';
      if (calltime_type == 'NE')
        this.display_calltime_non_emergency[index] = '';
      if (calltime_type == 'CO') this.display_calltime_coordinator[index] = '';
      if (calltime_type == 'DP') this.display_calltime_dispatcher[index] = '';
      if (calltime_type == 'SU') this.display_calltime_supervisor[index] = '';
      if (calltime_type == 'Backup') this.display_calltime_backup[index] = '';
    }
  }

  updateStatistic(data: {
    action: any;
    summary_id: any;
    source: any;
    action_at: any;
  }) {
    // update statistic once
    const action = data.action;
    // check summary_id
    if (
      // @ts-ignore
      this.tmp_summary_id.indexOf((data.summary_id + action) as number) == -1
    ) {
      // @ts-ignore
      this.tmp_summary_id.push(data.summary_id + action);
    } else {
      return;
    }
    if (environment.environment.env_mode !== 'production') console.log(action);
    if (action === 'RINGING') {
      // update summary
      // @ts-ignore
      this.conversations_amount.map((x) => {
        if (x.id === 'incoming') {
          return x.value++;
        }
      });
      // update chart
      this.data_chart['incoming'][this.data_chart['incoming'].length - 1]++;
      this.globalService.setChartData(JSON.stringify(this.data_chart));
    }
    if (action === 'ANSWER') {
      // update summary
      // @ts-ignore
      this.conversations_amount.map((x) => {
        if (x.id === 'answer') {
          return x.value++;
        }
      });
      // update chart
      this.data_chart['answer'][this.data_chart['answer'].length - 1]++;
      this.globalService.setChartData(JSON.stringify(this.data_chart));
    }
    if (
      action == 'ABANDON' ||
      action == 'QUEUE_FULL_ABANDON' ||
      action == 'QUEUE_FULL_ANOTHER_ABANDON'
    ) {
      // update summary
      // @ts-ignore
      this.conversations_amount.map((x: any) => {
        if (x.id === 'abandon') {
          return x.value++;
        }
      });
      // update abandon lists
      let has_abandon_list = this.abandon_lists.filter(
        (item: any) => item.source == data!.source
      );
      if (has_abandon_list.length > 0) {
        this.abandon_lists.map((item: any) => {
          if (data.source == item.source) {
            item.amount++;
            item.lastest_at = Math.floor(Date.now() / 1000);
          }
        });
      } else {
        // if not exist
        let abandon = {
          lastest_at: data.action_at,
          source: data.source,
          amount: 1,
          is_anonymous: false,
        };
        this.abandon_lists.push(abandon);
      }
      this.abandon_lists = this.sortAbandon(this.abandon_lists);

      // update chart
      this.data_chart['abandon'][this.data_chart['abandon'].length - 1]++;
      this.globalService.setChartData(JSON.stringify(this.data_chart));
      if (environment.environment.env_mode != 'production')
        console.log('summary updated');
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    this.is_fullscreen = false;
  }

  // toggleSetting() {
  //   this.dialogService
  //     .open(SettingDialogComponent, {
  //       context: {
  //         title: 'Setting',
  //       },
  //     })
  //     .onClose.subscribe((res) => {
  //       if (res) {
  //         this.setting.chart_format = res;
  //         this.initDashboard();
  //         this.showToast(
  //           this.toastr_status,
  //           this.toastr_title,
  //           this.toastr_content
  //         );
  //       }
  //     });
  // }

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

  private showToastCall(
    type: NbComponentStatus,
    title: string,
    body: string,
    special_line: any
  ) {
    const config = {
      status: type,
      hasIcon: this.toastr_hasIcon,
      position: this.toastr_position_call,
      duration: 1000000,
      preventDuplicates: this.toastr_preventDuplicates,
      timeOut: 0,
      extendedTimeOut: 0,
      tapToDismiss: false,
    };
    const titleContent = title ? `${title}` : '';
    if (special_line == 'TTRS') {
      this.special_line_ttrs = this.toastrService.show(
        body,
        `${titleContent}`,
        config
      );
    }
    if (special_line == '191') {
      this.special_line_191 = this.toastrService.show(
        body,
        `${titleContent}`,
        config
      );
    }
    if (special_line == 'Cellular') {
      this.special_line_cellular = this.toastrService.show(
        body,
        `${titleContent}`,
        config
      );
    }
    if (special_line == 'Data') {
      this.special_line_data = this.toastrService.show(
        body,
        `${titleContent}`,
        config
      );
    }
    if (special_line == 'Operator') {
      this.special_line_operator = this.toastrService.show(
        body,
        `${titleContent}`,
        config
      );
    }
  }
}
