import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from '@shared/components/header/header.component';
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
    component: HeaderComponent,
  },
  {
    path: ':id/login/:userId',
    pathMatch: 'full',
    component: HeaderComponent,
  },
  {
    path: ':id/add-room',
    component: HeaderComponent,
  },
  {
    path: ':id/balance',
    component: HeaderComponent,
  },
  {
    path: ':id/overdraft-settings',
    component: HeaderComponent,
  },
  {
    path: ':id/top-up',
    component: HeaderComponent,
  },
  {
    path: ':id/reports',
    pathMatch: 'full',
    component: HeaderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentsRoutingModule { }
