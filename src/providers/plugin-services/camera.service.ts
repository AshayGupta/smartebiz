import { Camera, CameraOptions } from '@ionic-native/camera';
import { Injectable } from '@angular/core';

@Injectable()
export class CameraService {

    constructor(private camera: Camera) { }

    takePicture(source) {
        return new Promise((resolve, reject) => {
            let srcType = source == 'PHOTOLIBRARY' ? this.camera.PictureSourceType.PHOTOLIBRARY :
                source == 'CAMERA' ? this.camera.PictureSourceType.CAMERA : -1;

            const options: CameraOptions = {
                quality: 50,
                targetHeight: 290,
                targetWidth: 290,
                sourceType: srcType,
                destinationType: this.camera.DestinationType.DATA_URL,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE,
                saveToPhotoAlbum: true,
                allowEdit: true
            }

            this.camera.getPicture(options).then((imageData) => {
                // imageData is either a base64 encoded string or a file URI
                // If it's base64 (DATA_URL):
                console.log('imageData -> ', imageData);
                // let base64Image = 'data:image/jpeg;base64,' + imageData;
                resolve('data:image/jpeg;base64,' + imageData);
            }, (err) => {
                // Handle error
                reject(err);
            });
        })
    }

}