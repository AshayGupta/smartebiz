import { ApiResource } from "../common/interfaces/serializer";

export class CountryCodeReq {
    
}

export class CountryCode {
    phMaxLngth: string;
    isoCode: string;
    countryCode: string;
    countryName: string;
    countryCodeId: string;

    constructor(json?) {
        this.phMaxLngth = json.phMaxLngth;
        this.isoCode = json.isoCode;
        this.countryCode = json.countryCode;
        this.countryName = json.countryName;
        this.countryCodeId = json.countryCodeId;
    }
}

  
export class CountryCodeResp extends ApiResource {
    countryCodes: CountryCode[];
 
    constructor(json?: any) {
        super(json);
        
        if (!json.data) return;
        let _json = json.data;

        this.countryCodes = [];
        _json.filter(item => {
            let obj = new CountryCode(item);
            this.countryCodes.push(obj);
        })
     }

}

export class CountryCodeReqSerializer {  

    toJson(obj: CountryCodeReq): any {
        console.log('CountryCodeReqSerializer toJson -> ', obj);
        
    }

    fromJson(json: any): CountryCodeResp {
        console.log('CountryCodeReqSerializer fromJson -> ', json);
        let response = new CountryCodeResp(json);
        return response;
    }
}