import { ApiResource } from "../common/interfaces/serializer";


export class LocateBranchReq {

}

export class LocateBranch {
    addressLine1: string;
    addressLine2: string;
    altPhone: string;
    category: string;
    city: string;
    countryCode: string;
    countryName: string;
    description: string;
    email: string;
    homePage: string;
    latitude: string;
    longitude: string;
    mainPhone: string;
    name: string;
    postalCode: string;
    pymtType: string;
    state: string;
}

export class LocateBranchResp extends ApiResource {
    locateBranch: LocateBranch[] = [];

    constructor(json: any) {
        super(json);

        let _json = json.data;
        for (var i = 0; i < _json.length; i++) {
            let item = new LocateBranch();
            item.addressLine1 = _json[i].addressLine1;
            item.addressLine2 = _json[i].addressLine2;
            item.altPhone = _json[i].altPhone;
            item.category = _json[i].category;
            item.city = _json[i].city;
            item.countryCode = _json[i].countryCode;
            item.countryName = _json[i].countryName;
            item.description = _json[i].description;
            item.email = _json[i].email;
            item.homePage = _json[i].homePage;
            item.latitude = _json[i].latitude;
            item.longitude = _json[i].longitude;
            item.mainPhone = _json[i].mainPhone;
            item.name = _json[i].name;
            item.postalCode = _json[i].postalCode;
            item.pymtType = _json[i].pymtType;
            item.state = _json[i].state;

            this.locateBranch.push(item);
        }

    }

}

export class LocateBranchSerializer {

    toJson(obj: LocateBranchReq): any {
        console.log('LocateBranchSerializer toJson -> ', obj);
        return {
        };
    }
    fromJson(json: any): LocateBranchResp {
        console.log('LocateBranchSerializer fromJson -> ', json);
        let response = new LocateBranchResp(json);
        return response;
    }
}