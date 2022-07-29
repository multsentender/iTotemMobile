import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComingSoonComponent } from '../core/coming-soon/coming-soon.component';
import { AgentComponent } from './components/page/agent.component';
import { EditAgentComponent } from './pages/edit-agent/edit-agent.component';

const routes: Routes = [
  {
    path: ':id',
    pathMatch: 'full',
    component: AgentComponent
  },
  {
    path: ':id/add-sub-agent',
    component: EditAgentComponent,
    data: {isSubAgent: true}
  },
  {
    path: ':id/edit',
    component: EditAgentComponent,
    data: {isSubAgent: false}
  },
  //TODO - replace within of the task of login pages 
  {
    path: ':id/login/new',
    pathMatch: 'full',
    component: ComingSoonComponent,
  },
  {
    path: ':id/login/:id',
    pathMatch: 'full',
    component: ComingSoonComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentsRoutingModule { }
