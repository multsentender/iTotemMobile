import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(x => x.ProfileModule),
  },
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  { path: 'login',
    loadChildren: () => import('./core/auth/auth.module').then(module => module.AuthModule)
  },
  { path: '**', children: [] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
