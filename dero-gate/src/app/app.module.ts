import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { ModalExample } from '../modal/modal.page';

@NgModule({
  declarations: [AppComponent, ModalExample],
  entryComponents: [ModalExample],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      name: '__derogate',
      driverOrder: ['localstorage', 'indexeddb', 'websql']
    }),
    AppRoutingModule
  ],
  providers: [
    AppComponent, // All Logic in root component
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
