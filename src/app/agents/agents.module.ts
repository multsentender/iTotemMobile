import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { GraphComponent } from './components/graph/agent-graph.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AgentsRoutingModule } from './agents-routing.module';
import { DirectiveModule } from '@shared/directives/directives.module';
import { ComponentsModule } from '@shared/components/components.module';
import { AgentLoginsComponent } from './components/login/agent-login.component';
import { MatTableModule } from '@angular/material/table';
import { AgentSubStructureComponent } from './components/agent-sub-structure/agent-sub-structure.component';

import { FormatMoneyPointsPipe } from './formatMoneyPoints.pipe';
import { RatesPipe } from './rates.pipe';

import { AgentComponent } from './components/page/agent.component';
import { EditAgentComponent } from './pages/edit-agent/edit-agent.component';
import { RatesComponent } from './pages/rates/rates.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GroupsComponent } from './components/groups/groups.component';


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
        MatExpansionModule,
        MatSlideToggleModule,
    ],
    declarations: [
        AgentComponent,
        NavbarComponent,
        GraphComponent,
        EditAgentComponent,
        AgentLoginsComponent,
        AgentSubStructureComponent,
        FormatMoneyPointsPipe,
        RatesPipe,
        AgentComponent,
        NavbarComponent,
        EditAgentComponent,
        RatesComponent,
        GroupsComponent,
    ],
    providers: []
})
export class AgentsModule { }
