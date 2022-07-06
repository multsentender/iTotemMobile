import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot([
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(module => module.SettingsModule),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'settings'
  },
])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
