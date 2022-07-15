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
import { NavbarComponent } from './navbar/navbar.component';

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
    ],
    declarations: [AgentComponent, NavbarComponent],
    providers: []
})
export class AgentsModule { }