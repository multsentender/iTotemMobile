import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AgentComponent } from './components/page/agent.component';
import { AgentsRoutingModule } from './agents-routing.module';
import { DirectiveModule } from '@shared/directives/directives.module';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { GraphComponent } from './components/graph/agent-graph.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';

import { EditAgentComponent } from './pages/edit-agent/edit-agent.component';
import { ComponentsModule } from '@shared/components/components.module';
import { AgentLoginsComponent } from './components/login/agent-login.component';
import { MatTableModule } from '@angular/material/table';
import { AgentSubStructureComponent } from './components/agent-sub-structure/agent-sub-structure.component';

import { FormatMoneyPointsPipe } from './formatMoneyPoints.pipe';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        AgentsRoutingModule,
        CommonModule,
        DirectiveModule,
        MatButtonModule,
        MatToolbarModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        NgxChartsModule,
        MatTabsModule,
        MatRippleModule,
        MatMenuModule,
        ComponentsModule,
        MatTableModule,
    ],
    declarations: [
        AgentComponent, 
        NavbarComponent, 
        GraphComponent, 
        EditAgentComponent, 
        AgentLoginsComponent, 
        AgentSubStructureComponent,
        FormatMoneyPointsPipe,
    ],
    providers: []
})
export class AgentsModule { }
