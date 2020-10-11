import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AlertInterface } from '../../common/interfaces/alert.interface';

@Injectable()
export class AlertService {

  private alert: any;

  constructor(private alertCtrl: AlertController) {
    console.log('AlertService');
  }

  public Alert = {
    confirm: (msg: string, title?: string, cancelText?: string, successText?: string, cssBody?: string) => {
      return new Promise((resolve, reject) => {
        this.alert = this.alertCtrl.create({
          title: title,
          message: msg,
          cssClass: cssBody,
          enableBackdropDismiss: false,
          buttons: [
            {
              text: cancelText,
              role: 'cancel',
              cssClass: 'alertDanger',
              handler: () => {
                reject(false);
              }
            },
            {
              text: successText,
              cssClass: 'alertSuccess',
              handler: () => {
                resolve(true);
              }
            }
          ]
        });
        this.alert.present();
      });

    },
    alert: (msg: string, title?: string, successText?: string, cssBody?: string) => {
      return new Promise((resolve, reject) => {
        this.alert = this.alertCtrl.create({
          title: title,
          message: msg,
          cssClass: cssBody,
          enableBackdropDismiss: false,
          buttons: [
            {
              text: successText || 'OK',
              cssClass: 'alertSuccess',
              handler: () => {
                resolve(true);
              }
            }
          ]
        });
        this.alert.present();
      });
    },
    prompt: (alert: AlertInterface) => {
      return new Promise((resolve, reject) => {
        this.alert = this.alertCtrl.create({
          title: alert.title,
          message: alert.message,
          cssClass: alert.cssClass,
          enableBackdropDismiss: alert.enableBackdropDismiss || true,
          inputs: [
            {
              name: 'input',
              placeholder: alert.placeholder,
              type: alert.type,
              value: alert.value
            }
          ],
          buttons: [
            {
              text: alert.cancelText,
              role: 'cancel',
              cssClass: 'alertDanger',
              handler: () => {
                reject(false);
              }
            },
            {
              text: alert.successText,
              cssClass: 'alertSuccess',
              handler: (data) => {
                resolve(data.input);
              }
            }
          ]
        });
        this.alert.present();
      });
    }
  }

  public AlertWith3Btn = {
    confirm: (msg: string, title?: string, cancelText?: string, successText?: string, cssBody?: string, bodyBtnTxt?: string) => {
      return new Promise((resolve, reject) => {
        this.alert = this.alertCtrl.create({
          title: title,
          message: msg,
          cssClass: cssBody,
          buttons: [
            {
              text: bodyBtnTxt,
              cssClass: 'termCondition',
              handler: () => {
                resolve('tnc');
              }
            },
            {
              text: cancelText,
              role: 'cancel',
              cssClass: 'alertDanger',
              handler: () => {
                reject(false);
              }
            },
            {
              text: successText,
              cssClass: 'alertSuccess',
              handler: () => {
                resolve(true);
              }
            }
          ]
        });
        this.alert.present();
      });
    }
  }


  dismissAlert() {
    this.alert.dismiss();
  }

}
