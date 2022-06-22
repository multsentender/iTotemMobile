import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@shared/components/components.module';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { DirectiveModule } from '@shared/directives/directives.module';
import { MatButtonModule } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: MenuComponent
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(module => module.ProfileModule)
      },
      {
        path: '**',
        redirectTo: 'profile'
      }
    ]),
    DirectiveModule,
    MatButtonModule,
    MatRippleModule,
  ]
})
export class SettingsModule { }
