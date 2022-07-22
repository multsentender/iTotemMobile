import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot([
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(module => module.SettingsModule),
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then(module => module.NotificationsModule),
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then(module => module.SearchModule),
  },
  {
    path: 'agent',
    loadChildren: () => import('./agents/agents.module').then(module => module.AgentsModule),
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
