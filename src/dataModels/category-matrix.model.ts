import { ApiResource } from "../common/interfaces/serializer";

export class CategoryMatrix {
    category: string;
    lob: string;
    owner: string;
    subCategory: string;
    company: string;
    source: string;
    srstatus: string;
    action: string;

    constructor(json?) {
        if (json) {
            this.category = json.CATEGORY;
            this.lob = json.LOB;
            this.owner = json.OWNER;
            this.subCategory = json.SUB_CATEGORY;
            this.company = json.COMPANY;
            this.srstatus = json.SRStatus;
            this.source = json.Source;
            this.action = json.Action;
        }
    }
}

export class CategoryMatrixReq {
    lob: string;
    action: string;
}

export class CategoryMatrixResp extends ApiResource {
    categoryMatrix: CategoryMatrix[] = []

    constructor(json?: any) {
        super(json);

        if (json) {
            let _json = json.data;

            for (var i = 0; i < _json.length; i++) {
                let lists = new CategoryMatrix(_json[i]);
                this.categoryMatrix.push(lists);
            }
        }
    }
}

export class CategoryMatrixSerializer {

    toJson(obj: CategoryMatrixReq): any {
        console.log('CategoryMatrixSerializer toJson -> ', obj);
        return {
        };
    }

    fromJson(json: any): CategoryMatrixResp {
        console.log('CategoryMatrixSerializer fromJson -> ', json);
        let response = new CategoryMatrixResp(json);
        return response;
    }
}