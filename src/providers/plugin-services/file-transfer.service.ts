import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@Injectable()
export class FileTransferService {

    private fileTransfer: FileTransferObject

    constructor(private transfer: FileTransfer) {
        console.log('FileTransferService');
        this.fileTransfer = this.transfer.create();
    }

    upload(fileName: string, filePath: string, endPoint: string) : Promise<any> {
        let options: FileUploadOptions = {
            fileKey: 'file',
            fileName: fileName,  // with extension like .jpg,
            headers: {}
        }

        return this.fileTransfer.upload(filePath, endPoint, options)
    }

    // download() {
    //     const url = 'http://www.example.com/file.pdf';
    //     fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
    //         console.log('download complete: ' + entry.toURL());
    //     }, (error) => {
    //         // handle error
    //     });
    // }

}
