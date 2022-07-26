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
import { EditAgentComponent } from './pages/edit-agent/edit-agent.component';
import { ComponentsModule } from '@shared/components/components.module';

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
        ComponentsModule,
    ],
    declarations: [AgentComponent, NavbarComponent, EditAgentComponent],
    providers: []
})
export class AgentsModule { }