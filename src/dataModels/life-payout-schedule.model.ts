import { ApiResource } from "../common/interfaces/serializer";
import { AccountDetails, Caption } from "./account-details.model";

import { Utils } from '../common/utils/utils';

export class LifePayoutScheduleReq {
    startDate: string;
    sumAssured: string;
    term: string;
    planNumber: string;
}

export class LifePayoutScheduleResp extends ApiResource {
    payoutSchedule = [];


    
    constructor(json: any) {
        super(json);

        let _json = json.data;

        let accountDetails: AccountDetails[][] = [];
        let captions: Caption[] = [];

        for (var i = 0; i < _json.length; i++) {
            let detailsList: AccountDetails[] = [];
            for (var j = 0; j < _json[i].length; j++) {
                let details = new AccountDetails(_json[i][j]);
                detailsList.push(details);
                if (i == 0) {
                    captions.push(details.caption);
                }
            }
            accountDetails.push(detailsList);
        }

        this.payoutSchedule.push(accountDetails);
        this.payoutSchedule.push(captions);

    }
}

export class LifePayoutScheduleSerializer {

    toJson(obj: LifePayoutScheduleReq): any {
        console.log('LifePayoutScheduleSerializer toJson -> ', obj);
        return {
            planNumber: obj.planNumber,
            startDate:Utils.formatDateYYDDMM(obj.startDate), 
            sumAssured: Utils.replaceCommaFromString(obj.sumAssured),
            term: obj.term 
        };
    }

    fromJson(json: any): LifePayoutScheduleResp {
        console.log('LifePayoutScheduleSerializer fromJson -> ', json);
        let response = new LifePayoutScheduleResp(json);
        return response;
    }
}