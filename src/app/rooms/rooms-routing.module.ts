import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComingSoonComponent } from '../core/coming-soon/coming-soon.component';

const routes: Routes = [
  //TODO
  {
    path: ':id',
    pathMatch: 'full',
    component: ComingSoonComponent
  },
  {
    path: ':id/edit',
    component: ComingSoonComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomsRoutingModule { }
