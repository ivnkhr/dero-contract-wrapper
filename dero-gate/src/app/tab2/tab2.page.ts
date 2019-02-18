import { Component } from '@angular/core';
import { AppComponent, AgentStatus, AgentStatusColors } from '../app.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public rootApp: AppComponent) {
    console.log(AgentStatus[this.rootApp.wallet_status]);
    console.log(AgentStatus[this.rootApp.daemon_status]);
  }

  AgentStatus = AgentStatus;
  AgentStatusColors = AgentStatusColors;

}
