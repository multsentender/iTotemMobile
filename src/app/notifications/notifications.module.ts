import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NotificationsComponent } from './list/notifications.component';
import { ComponentsModule } from '@shared/components/components.module';


@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: NotificationsComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]),
    ComponentsModule,
  ]
})
export class NotificationsModule { }
