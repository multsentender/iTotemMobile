import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@shared/components/header/header.component';

@NgModule({
  imports: [RouterModule.forRoot([
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(module => module.SettingsModule),
  },
  {
    path: 'agent',
    loadChildren: () => import('./agents/agents.module').then(module => module.AgentsModule),
  },

  // Plugs
  {
    path: 'notifications',
    component: HeaderComponent,
  },
  {
    path: 'search',
    component: HeaderComponent,
  },

  // Plugs: rooms
  {
    path: 'room/:id',
    pathMatch: 'full',
    component: HeaderComponent
  },
  {
    path: 'room/:id/edit',
    component: HeaderComponent,
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
