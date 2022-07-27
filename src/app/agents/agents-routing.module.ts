import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentsRoutingModule { }
