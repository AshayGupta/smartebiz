export class RegexPattern {
  static readonly onlyContainLetters = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  static readonly email = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  static readonly onlyContainNumbers = /^[0-9]*$/;
  static readonly onlyZeroToNine = /[0-9]/;
  static readonly exceptZeroToNine = /[^0-9]/gi;
  static readonly numStartWithZero = /^0[0-9]*$/;
  static readonly password = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
}

export class ImgsPath {
  static readonly britamLogo = "assets/imgs/Britam_logo.png";
}

const ApiConfig = {
  version: "1.0/"
};

export class ApiUrl {
  static readonly localUrl = 'http://localhost:9090/'; // Local Vishal machine
  static readonly devUrl = 'http://192.168.1.58:9090/'; // DEV URL
  static readonly qaUrl = 'http://10.10.3.184:9090/'; // QA URL
  static readonly uatUrl = 'http://mobileuat.britam.com/'; // UAT URL
  static readonly uatUrlHttps = "https://mobileuat.britam.com/"; // UAT URL with https
  static readonly prodUrl = 'https://mobilelive.britam.com/'; // LIVE URL

  static domainUrl = ApiUrl.prodUrl; // set domain url

  static gatesAppend = ApiUrl.domainUrl + 'gates/'; // set gates url
  static readonly baseUrl: string = ApiUrl.gatesAppend + ApiConfig.version;

  static readonly baseUrlBOImg = ApiUrl.gatesAppend;
  static readonly profileImgUrl = ApiUrl.domainUrl == ApiUrl.qaUrl ? 'http://customerconnectqa.britam.com' :
    ApiUrl.domainUrl == ApiUrl.uatUrl ? 'http://customerconnectuat.britam.com' :
      ApiUrl.domainUrl == ApiUrl.uatUrlHttps ? 'https://customerconnectuat.britam.com' :
        ApiUrl.domainUrl == ApiUrl.prodUrl ? 'https://customerconnect.britam.com' : '';
}

export const Environment = {
  prod: ApiUrl.domainUrl.includes(ApiUrl.prodUrl) ? true : false,
  dev: ApiUrl.domainUrl.includes(ApiUrl.devUrl) ? true : false,
  qa: ApiUrl.domainUrl.includes(ApiUrl.qaUrl) ? true : false,
  uat: ApiUrl.domainUrl.includes(ApiUrl.uatUrl) ? true : false,
  uatHttps: ApiUrl.domainUrl.includes(ApiUrl.uatUrlHttps) ? true : false,
}
