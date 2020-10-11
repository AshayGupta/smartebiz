import { ApiResource } from "../common/interfaces/serializer";

export class ManageCollectionDocTypeReq {

}

export class DocType {
  id: string;
  docType: string;
  constructor(json?: any) {
    this.id = json._id;
    this.docType = json.docType;
  }
}

export class ManageCollectionDocTypeResp extends ApiResource {
  docType: DocType[]=[];

  constructor(json?: any) {
    super(json);

    if (json) {
      let _json = json.data;

      for (let i = 0; i < _json.length; i++) {
        let type = new DocType(_json[i]);
        this.docType.push(type);
      }
      console.log("MOdel====>",this.docType);
    }
  }

}

export class ManageCollectionDocTypeSerializer {

  toJson(obj: ManageCollectionDocTypeReq): any {
    console.log('ManageCollectionDocTypeSerializer toJson -> ', obj);
    return {
    };
  }

  fromJson(json: any): ManageCollectionDocTypeResp {
    console.log('ManageCollectionDocTypeSerializer fromJson -> ', json);
    let response = new ManageCollectionDocTypeResp(json);
    return response;
  }
}
