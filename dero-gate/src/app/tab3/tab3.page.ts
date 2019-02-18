import { Component } from '@angular/core';
import { AppComponent, AgentStatus, AgentStatusColors } from '../app.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public rootApp: AppComponent) {
    console.log(AgentStatus[this.rootApp.wallet_status]);
    console.log(AgentStatus[this.rootApp.daemon_status]);
  }

  AgentStatus = AgentStatus;
  AgentStatusColors = AgentStatusColors;

  public saveEndpoints() {
    console.log('Endpoints Saved');
    this.rootApp.storage.set('wallet', this.rootApp.wallet);
    this.rootApp.storage.set('daemon', this.rootApp.daemon);
  }

}
