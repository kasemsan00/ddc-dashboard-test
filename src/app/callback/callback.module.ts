import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CallbackRoutes } from './callback-routing.module';
import { CallbackComponent } from './callback.component';
import { AuthService } from '../services/auth.service'
import { from } from 'rxjs';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CallbackRoutes),
    FormsModule,
  ],
  declarations: [CallbackComponent],
  providers:[AuthService]
})
export class CallbackModule { }
