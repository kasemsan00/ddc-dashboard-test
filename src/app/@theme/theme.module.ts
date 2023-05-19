import {
  ModuleWithProviders,
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbBadgeModule,
  NbThemeModule,
  NbCardModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  FooterComponent,
  HeaderComponent,
  SearchInputComponent,
  TinyMCEComponent,
} from './components';
import {
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
} from './pipes';
import {
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
} from './layouts';
import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { DARK_THEME } from './styles/theme.dark';
import { ToggleSettingsButtonComponent } from './components/toggle-settings-button/toggle-settings-button.component';
import { SettingDialogComponent } from './components/setting-dialog/setting-dialog.component';
import { BtnSwitchComponent } from './components/btn-switch/btn-switch.component';
import { NbSidebarService } from '@nebular/theme';

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
  NbBadgeModule,
  NbCardModule,
];
const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  TinyMCEComponent,
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
];
const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];

@NgModule({
  imports: [
    CommonModule,
    ...NB_MODULES,
    FormsModule,
    ReactiveFormsModule,
    NbThemeModule.forRoot({ name: 'default' }),
  ],
  exports: [CommonModule, ...PIPES, ...COMPONENTS],
  declarations: [
    ...COMPONENTS,
    ...PIPES,
    ToggleSettingsButtonComponent,
    SettingDialogComponent,
    BtnSwitchComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [NbSidebarService],
    };
  }
}

// export class NgdThemeModule {
//   static forRoot(): ModuleWithProviders<NgdThemeModule> {
//     return {
//       ngModule: NgdThemeModule,
//       providers: [
//         NgdHighlightService,
//         NgdTextService,
//         NgdTabbedService,
//         NgdStructureService,
//         NgdCodeLoaderService,
//         NgdIframeCommunicatorService,
//         NgdStylesService,
//         NgdVersionService,
//         NgdPaginationService,
//         NgdAnalytics,
//         NgdMenuService,
//         NgdVisibilityService,
//         NgdMetadataService,
//         NgdArticleService,
//         NgdLastViewedSectionService,
//       ],
//     };
//   }
// }
