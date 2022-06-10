import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@shared/components/components.module';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { DirectiveModule } from '@shared/directives/directives.module';



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
    DirectiveModule
  ]
})
export class SettingsModule { }
