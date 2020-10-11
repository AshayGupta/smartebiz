import { ApiResource } from "../common/interfaces/serializer";
  

export class SyncVisitorsRequestReq {
        fp: string;
        fpSign: string;
        ip: string;
        platform: string;
        lfrId:string;
        crmId: string;
        macAddress: string;
        // imei: string;
        uuid: string;
        model: string;
        serial: string;
        version: string;  
        isVirtual: any;
        channel: string='M';
}

export class SyncVisitorsRequestResp extends ApiResource {
  
    constructor(json?: any) {
        super(json);  
    }
}

export class SyncVisitorsRequestSerializer {

    toJson(obj: SyncVisitorsRequestReq): any {
        console.log('SyncVisitorsSerializer toJson -> ', obj);
        return {
            fp: obj.fp,
            fpSign: obj.fpSign, 
            ip: obj.ip,
            platform: obj.platform,
            lfrId: obj.lfrId,
            crmId: obj.crmId,
            macAddress: obj.macAddress,
            uuid:obj.uuid,             
            model: obj.model,
            serial: obj.serial,
            version:obj.version,
            isVirtual:obj.isVirtual,
            channel:obj.channel
            
        };
    }

    fromJson(json: any): SyncVisitorsRequestResp {
        console.log('SyncVisitorsRequestSerializer fromJson -> ', json);
        let response = new SyncVisitorsRequestResp(json);
        return response;  
    }
}