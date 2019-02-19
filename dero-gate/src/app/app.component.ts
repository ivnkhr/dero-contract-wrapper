import { Component } from '@angular/core';

import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ModalExample } from '../modal/modal.page';

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
    private http: HttpClient,
    public modalController: ModalController
  ) {
    this.initializeApp();
  }

  public wallet: any = '';
  public daemon: any = '';

  public wallet_status: any = 0; // Disconnected / Checking / Not Synced / Ready
  public daemon_status: any = 0; // Disconnected / Checking / Not Synced / Ready

  public wallet_response = null;
  public daemon_response = null;
  public wallet_execution_response = null;

  public contract = '6903fd74504405053dd07410cbf4b25649e6612123fe50c83b56f09c8f6bb63c';
  public contract_response = null;
  public variables = [''];
  public active_method = null;
  public command = {};

  public execute_command() {
    this.wallet_execution_response = null;
    console.log(this.active_method);
    // Preparing clean object to pass into wallet
    const subject = this.active_method.value.P;
    const copm_tx = {
      'mixin' : 0,
      'get_tx_key' : true,
      'sc_tx' :
      {
        'entrypoint': this.active_method.key,
        'scid': this.contract,
        'params': {}
      }
    };

    if (subject) {
      for (let i = 0; i < subject.length; i++ ) {
        if (subject[i].N === 'value') {
          copm_tx.sc_tx['value'] = parseFloat(subject[i].V || 0);
        } else {
          if ( subject[i].T === 1 ) { // Num
            copm_tx.sc_tx.params[ subject[i].N ] = parseFloat(subject[i].V || 0);
          } else { // String
            copm_tx.sc_tx.params[ subject[i].N ] = (subject[i].V || '').toString();
          }
        }
      }
    }

    if ( Object.keys(copm_tx.sc_tx.params).length === 0 ) {
      delete copm_tx.sc_tx.params;
    }

    console.log(copm_tx);

    // Sending Raw to omit CORS
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    const params = {};
    const data = JSON.stringify({ 'jsonrpc' : '2.0', 'id': 0, 'method': 'transfer_split', 'params': copm_tx});
    this.http.post(this.wallet + '/json_rpc', data, httpOptions).subscribe(
      responseAfterSuccess => {
        console.log(responseAfterSuccess);
        if ( responseAfterSuccess['error'] ) {
          alert( responseAfterSuccess['error']['message'] );
        } else {
          this.wallet_execution_response = responseAfterSuccess;
        }
      },
      responseAfterError => { alert('Check CLI Wallet For Errors'); this.wallet_status = 0; this.wallet_execution_response = null; }
    );
  }

  public async view_contract() {
    const modal = await this.modalController.create({
      component: ModalExample,
      componentProps: { value: this.contract_response.txs[0].sc_raw }
    });
    return await modal.present();
  }

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
        const subject = responseAfterSuccess;
        if (subject['status'] === 'OK') {
          this.contract_response = subject;
        } else {
          alert(subject['status']);
          this.contract_response = null;
        }
      },
      responseAfterError => { alert('Error During Contract Fetching'); this.contract_response = null; }
    );
  }

  public ping_wallet() {
    this.wallet_status = 1;
    console.log('Ping: Wallet');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    const params = {};
    const data = JSON.stringify({ 'jsonrpc' : '2.0', 'id': 0, 'method': 'getbalance', 'params': params});
    this.http.post(this.wallet + '/json_rpc', data, httpOptions).subscribe(
      responseAfterSuccess => {
        const subject = responseAfterSuccess;
        if (subject['id'] === 0) {
          this.wallet_response = subject;
          this.wallet_status = 3;
        } else {
          alert('Error: Something went wrong');
          this.wallet_response = null;
        }
      },
      responseAfterError => { this.wallet_status = 0; this.wallet_response = null; }
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
      responseAfterError => { this.daemon_status = 0;  this.daemon_response = null; }
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
