import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentsRoutingModule { }
