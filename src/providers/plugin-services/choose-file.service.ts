import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileAttachmentReq } from '../../dataModels/file-attachment.model';

@Injectable()
export class ChooseFileService {

    constructor(
        private fileChooser: FileChooser, 
        private filePicker: IOSFilePicker, 
        private file: File,
        private plt: Platform
    ) {
        console.log('ChooseFileService');
    }

    chooseFile(): Promise<any> {
        if (this.plt.is('android')) {
            return this.selectAndroid();
        }
        else if (this.plt.is('ios')) {
            return this.selectIos();
        }
        else {
            console.log('Invalid Platform');
            return;
        }
    }

    private selectAndroid(): Promise<any> {
        let obj = new FileAttachmentReq();

        return new Promise((resolve, reject) => {
            this.fileChooser.open().then(uri => {
                console.log('selectAndroid uri ->', uri);
                obj.filePath = uri;
                // obj.fileName = uri.substring(uri.lastIndexOf('.') +1)

                this.file.resolveLocalFilesystemUrl(uri).then(fileObj => {
                    console.log('resolveLocalFilesystemUrl fileObj ->', fileObj);
                    
                    fileObj.getMetadata(meta => {
                        obj.fileSize = meta.size;
                    });
                });
                resolve(obj);
            },
            err => {
                reject(err);
            });
        });
    }

    private selectIos(): Promise<any> {
        let obj = new FileAttachmentReq();
        return new Promise((resolve, reject) => {
            resolve(obj);
        });
    }

}
