import { ActionSheetController, ActionSheet, ActionSheetButton } from 'ionic-angular'
import { Injectable } from '@angular/core';

export interface ActionSheetModel {
    actionsheetText?: string;
}

@Injectable()
export class ActionsheetService {

    private actionSheet: ActionSheet

    constructor(private actionSheetCtrl: ActionSheetController) { }

    ActionSheet = {
        profilePicSheet: () => {
            return new Promise((resolve, reject) => {
                this.actionSheet = this.actionSheetCtrl.create({
                    title: 'Profile Photo',
                    enableBackdropDismiss: true,
                    buttons: [
                        {
                            text: 'Gallery',
                            // role: 'destructive',
                            handler: () => {
                                resolve('gallery');
                            }
                        },
                        {
                            text: 'Camera',
                            handler: () => {
                                resolve('camera')
                            }
                        },
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            handler: () => {
                                console.log('Cancel clicked');
                            }
                        }
                    ]
                });
                this.actionSheet.present();
            });
        },
        simpleListSheet: (title?: string, buttons?: Array<ActionSheetModel>) => {
            return new Promise((resolve, reject) => {
                let buttonsArray: ActionSheetButton[] = [];

                for(let i=0; i< buttons.length; i++) {
                    let buttonObj: ActionSheetButton = {
                        text: buttons[i].actionsheetText,
                        handler: () => resolve(i)
                    }
                    buttonsArray.push(buttonObj);
                }

                this.actionSheet = this.actionSheetCtrl.create({
                    title: title,
                    enableBackdropDismiss: true,
                    buttons: buttonsArray
                });
                this.actionSheet.present();
            });
        }
    }


}