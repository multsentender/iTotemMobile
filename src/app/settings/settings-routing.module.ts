import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
    { path: '', component: MenuComponent},
    { path: 'profile', component: ProfileComponent},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class SettingsRoutingModule { }