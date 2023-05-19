import { Routes } from '@angular/router';

import { CallbackComponent } from './callback.component';

export const CallbackRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: '',
        component: CallbackComponent
    }]
}
];

