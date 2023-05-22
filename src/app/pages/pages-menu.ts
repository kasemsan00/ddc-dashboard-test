import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'pie-chart-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Log out',
    icon: 'log-out-outline',
    link: '/auth/logout',
  },
];
