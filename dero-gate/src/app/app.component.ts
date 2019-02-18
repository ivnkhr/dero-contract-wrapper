import { Component } from '@angular/core';

import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export enum AgentStatus {
   checking = 1,
   notsynced = 2,
   ready = 3,
   offline = 0
}

export enum AgentStatusColors {
   warning = 1,
   secondary = 2,
   success = 3,
   danger = 0
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public storage: Storage,
    private http: HttpClient
  ) {
    this.initializeApp();
  }

  public wallet: any = '';
  public daemon: any = '';

  public wallet_status: any = 0; // Disconnected / Checking / Not Synced / Ready
  public daemon_status: any = 0; // Disconnected / Checking / Not Synced / Ready

  public wallet_response = null;
  public daemon_response = null;
  public wallet_response = null;

  public contract = '6903fd74504405053dd07410cbf4b25649e6612123fe50c83b56f09c8f6bb63c';
  public contract_response = null;
  public variables = [''];
  public active_method = null;

  public fetch_contract(sc_keys) {
    console.log('Ping: Contract');
    this.active_method = null;
    const params = {'txs_hashes': [this.contract], 'sc_keys': []};
    if ( sc_keys ) {
      params.sc_keys = sc_keys;
    }
    const data = JSON.stringify(params);
    this.http.post(this.daemon + '/gettransactions', data).subscribe(
      responseAfterSuccess => {
        console.log(responseAfterSuccess);
        this.contract_response = responseAfterSuccess;
      },
      responseAfterError => { alert('Error During Contract Fetching'); }
    );
  }

  public ping_wallet() {
    this.wallet_status = 1;
    console.log('Ping: Wallet');
    this.http.get(this.wallet + '/json_rpc', {responseType: 'text'}).subscribe(
      responseAfterSuccess => { console.log(responseAfterSuccess); },
      responseAfterError => { this.wallet_status = 0; }
    );
  }

  public ping_daemon() {
    this.daemon_status = 1;
    console.log('Ping: Daemon');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    const params = {};
    const data = JSON.stringify({ 'jsonrpc' : '2.0', 'id': 0, 'method': 'get_info', 'params': params});
    this.http.post(this.daemon + '/json_rpc', data, httpOptions).subscribe(
      responseAfterSuccess => {
        this.daemon_response = responseAfterSuccess;
        this.daemon_status = 3;
      },
      responseAfterError => { this.daemon_status = 0; }
    );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.ready().then(() => {

        this.storage.get('wallet').then((val) => {
          if (val) {
            console.log('Your wallet is', val);
            this.wallet = val;
          } else {
            this.wallet = 'http://127.0.0.1:30307';
            this.storage.set('wallet', this.wallet);
          }
          this.ping_wallet();
        });

        this.storage.get('daemon').then((val) => {
          if (val) {
            console.log('Your daemon is', val);
            this.daemon = val;
          } else {
            this.daemon = 'http://127.0.0.1:30306';
            this.storage.set('daemon', this.daemon);
          }
          this.ping_daemon();
        });

      });
    });
  }
}
