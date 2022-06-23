import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@shared/auth/auth.guard';
import { environment } from '../environments/environment';

let routes: Routes = (environment.production) ? [] : [{
  path: 'devLogin',
  loadChildren: () => import('./core/auth/auth.module').then(module => module.AuthModule),
  canActivate: [AuthGuard]
}];

routes = routes.concat([
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(module => module.SettingsModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'settings'
  },
]);

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
