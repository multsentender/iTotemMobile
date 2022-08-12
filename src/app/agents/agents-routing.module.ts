import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComingSoonComponent } from '../core/coming-soon/coming-soon.component';
import { AgentComponent } from './components/page/agent.component';
import { EditAgentComponent } from './pages/edit-agent/edit-agent.component';
import { RatesComponent } from './pages/rates/rates.component';

const routes: Routes = [
  {
    path: ':id',
    pathMatch: 'full',
    component: AgentComponent
  },
  {
    path: ':id/add-sub-agent',
    pathMatch: 'full',
    component: EditAgentComponent,
    data: {isSubAgent: true}
  },
  {
    path: ':id/edit',
    pathMatch: 'full',
    component: EditAgentComponent,
    data: {isSubAgent: false}
  },
  {
    path: ":id/rates",
    pathMatch: 'full',
    component: RatesComponent
  },
  //TODO - replace within of the task of login pages
  {
    path: ':id/login/new',
    pathMatch: 'full',
    component: ComingSoonComponent,
  },
  {
    path: ':id/login/:userId',
    pathMatch: 'full',
    component: ComingSoonComponent,
  },
  {
    path: ':id/add-room',
    component: ComingSoonComponent,
  },
  {
    path: ':id/balance',
    component: ComingSoonComponent,
  },
  {
    path: ':id/overdraft-settings',
    component: ComingSoonComponent,
  },
  {
    path: ':id/top-up',
    component: ComingSoonComponent,
  },
  {
    path: ':id/reports',
    pathMatch: 'full',
    component: ComingSoonComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentsRoutingModule { }
