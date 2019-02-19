import { Component, Input } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'modal-page',
  template: `
  <ion-header>
    <ion-toolbar color="secondary">
      <ion-title>Contract Content</ion-title>
      <ion-buttons slot="end">
        <ion-button (click)="dismissModal()">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content color="light" scrollX scrollY>
    <pre>
      <code>
        {{value}}
      </code>
    </pre>
  </ion-content>
  `,
  styles: ['pre { font-size: 11px; overflow: visible; padding: 10px; }']
})
export class ModalExample {

  // "value" passed in componentProps
  @Input() value: any;

  constructor(public modalController: ModalController) {
    // componentProps can also be accessed at construction time using NavParams
  }

  public dismissModal() {
    this.modalController.dismiss({
      'result': 'close'
    });
  }

}
