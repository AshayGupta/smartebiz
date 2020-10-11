import { Lob } from './../enums/enums';
import { AgeFormatInterface } from './../interfaces/date.interface';
import { FileAttachmentReq } from './../../dataModels/file-attachment.model';
import { Observable } from "rxjs";
import { stringify } from "@angular/compiler/src/util";

export class Utils {

    static formatDateDDMMYY(date) {
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        var currentDate = new Date(date);

        // if (currentDate) {
        //     return date;
        // }
        var day = currentDate.getDate();
        var monthIndex = currentDate.getMonth();
        var year = currentDate.getFullYear();

        if (!day || !monthNames[monthIndex] || !year) {
            return date;
        }
        return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }

    static replaceCommaFromString(string) {
        var data = string.replace(/,/g, '');
        return data;
    }

    static formatDateYYDDMM(date) {
        if (this.isEmpty(date)) return "";

        var currentDate = new Date(date);
        var day = currentDate.getUTCDate();
        var month = currentDate.getUTCMonth() + 1;
        var year = currentDate.getUTCFullYear();
        return year + '-' + ((month < 10) ? '0' + month : month) + '-' + ((day < 10) ? '0' + day : day);
    }

    static formatIntoDateDDMMYY(date) {
        if (this.isEmpty(date)) return "";

        var currentDate = new Date(date);
        var day = currentDate.getUTCDate();
        var month = currentDate.getUTCMonth() + 1;
        var year = currentDate.getUTCFullYear();
        return ((day < 10) ? '0' + day : day) + '/' + ((month < 10) ? '0' + month : month) + '/' + year;
    }

    static DDMMYYYYIntoYYYYMMDD(date: string): string {
        let d = date.split('/');
        let dateString = d[2] + '-' + d[1] + '-' + d[0];
        return dateString;
    }

    static DateToYYYYMMDD(date:Date){
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var mmChars = mm.split('');
        var ddChars = dd.split('');

        return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
    }

    static getAge(date: AgeFormatInterface) {
        let { day, month, year } = date;

        var today = new Date();
        var age = today.getFullYear() - year;

        if (today.getMonth() < month - 1 || (today.getMonth() == month && today.getDate() < day)) {
            age--;
        }
        return age;
    }

    static getAgeFromString(date: string) {
        let year = new Date(date).getFullYear();
        let month = new Date(date).getMonth();
        let day = new Date(date).getDate();

        var today = new Date();
        var age = today.getFullYear() - year;

        if (today.getMonth() < month - 1 || (today.getMonth() == month && today.getDate() < day)) {
            age--;
        }
        return age;
    }

    static startTimer(time?: number): Observable<any> {
        return Observable.timer(0, 1000)
            .take(time)
            .map(() => --time)
    }

    static stopTimer() {
        // Utils.timer.unsubscribe();
    }

    static removeNull(obj) {
        if (obj == undefined || obj == NaN) {
            return '';
        }
        else {
            return obj;
        }
    }

    static isEmpty(value): boolean {
        if (value == undefined || value == "undefined" || value == '' || value == null || value == NaN) {
            return true;
        }
        return false;
    }

    static autoIncID() {
        let value = Math.floor(100000 + (Math.random() * 900000));
        return value;
    }

    static roundOffValue(value) {
        var round = Math.round(value);
        return round;
    }

    static ceilValue(value) {
        var ceil = Math.ceil(value);
        return ceil;
    }

    static roundToDecimal(value: string, decimalCount: number): string {
        if (isNaN(parseFloat(value))) return '0.00';

        let dv = (parseFloat(value) * decimalCount);
        var finalValue = parseInt(dv.toString()) / decimalCount;
        return finalValue.toString();
    }

    static getLobID(name: string) {
        var lob = { "Life": Lob.LIFE, "Asset": Lob.AMC, "GI": Lob.GI ,"Pension":Lob.PENSION};
        return lob[name];
    }

    static getLobName(id: string) {
        var lob = { "4": "Life", "6": "Asset", "5": "GI","Pension":"3" };
        return lob[id];
    }

    static readFileInBase64(event) {
        return new Promise((resolve, reject) => {
            let fileObj: FileAttachmentReq = new FileAttachmentReq();
            const file: File = event.target.files[0];

            fileObj.fileName = file.name;
            fileObj.fileExtension = file.type;
            fileObj.fileSize = file.size;
            // fileObj.fileId = new Date().getTime().toString();

            resolve(fileObj);
            // const reader = new FileReader();
            // reader.readAsDataURL(file);
            // reader.onload = () => {
            //     fileObj.base64File = reader.result;
            //     resolve(fileObj);
            // };
        })
    }

    static base64FileSize(base64String: string) {
        var stringLength = base64String.length - 'data:image/png;base64,'.length;

        var sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
        var sizeInKb = sizeInBytes/1000;
        console.log('sizeInKb -> ', sizeInKb);

        return sizeInKb;
    }

    static base64MimeType(base64String: string) {
        var result = null;
      
        if (typeof base64String !== 'string') {
          return result;
        }
      
        var mime = base64String.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
      
        if (mime && mime.length) {
          result = mime[1];
        }
      
        return result;
    }



}

