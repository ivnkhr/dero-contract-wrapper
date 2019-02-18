import { Component } from '@angular/core';

import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  public wallet: String = '';
  public daemon: String = '';

  public wallet_status: Int = 0; // Disconnected / Not Synced / Ready
  public daemon_status: Int = 0; // Disconnected / Not Synced / Ready

  public ping_wallet(): Void {
    console.log('Ping: Wallet');
    this.wallet_status = 2;
  }

  public ping_daemon(): Void {
    this.daemon_status = 2;
    console.log('Ping: Daemon');
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
