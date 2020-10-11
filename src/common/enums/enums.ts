export enum LocalStorageKey {
    BearerToken = 'BearerToken',
    IsLoggedIn = 'IsLoggedIn',
    NationalID = 'NationalID',
    NationalIDType = 'NationalIDType',
    PageFlow = 'PageFlow',
    UserStatus = 'UserStatus',
    ProfilePic = 'ProfilePic',
    Timeout = 'Timeout',
    Delete = 'Delete',
    Edit = 'Edit'
}

export enum ClientDetailsStorageKey {
    Salutation='Salutation',
    FirstName = 'FirstName',
    MiddleName = 'MiddleName',
    LastName = 'LastName',
    DateOfBirth='DateOfBirth',
    Nationality='Nationality',
    Gender='Gender',
    PersonStatus='PersonStatus',
    PhoneNumber = 'PhoneNumber',
    msisdn = 'msisdn',
    Email = 'Email',
    PassportNumber='PassportNumber',
    PinNumber='PinNumber',
    contactId = 'contactId',
    PersonNo = 'PersonNo',
  }

export enum ApiRouter {
    ApiRouter1 = 'flits/',
    ApiRouter2 = 'sweeps/',
    ApiRouter3 = 'fliers/',
}

export enum StatusCode {
    Status200 = 200,
    Status403 = 403,
    Status404 = 404,
    Status412 = 412,
    Status510 = 510
}

export enum PageName {
    Signup,
    ForgotPwd,
    VerifyLoanPage,
    PartialWithdrawVerifyPage,
    LoginPage,
    VerifyBeneficiaryPage,
    KnowYourCustomerPage,
    WithdrawVerifyPage,
    SwitchVerifyPage,
    PensionWithdrawVerifyPage,
    InitialWithdrawVerifyPage
}

export enum UserStatus {
    New = 'new',
    Yes = 'yes',
    No = 'no'
}

export enum ProductTag {
    ALL = 'ALL',
    LIFE = 'LIFE',
    AMC = 'AMC',
    PENSION = 'PENSION',
    GI = 'GI',
    MP = 'MP',
    SR = 'SR'
}

export enum Lob {
    PENSION = '3',
    LIFE = '4',
    GI = '5',
    AMC = '6',
    ALL = '',
    GROUPLIFE = ''
}

export enum LoanConstants {
    STAMP_DUTY = 'STAMP_DUTY',
    PORTAL_CHARGE = 'PORTAL_CHARGE',
    LFEE_DMND = 'LFEE_DMND'
}

export enum SourceTag {
    MOBILE = 'MOBILE',
    CP = 'CP'
}

export enum ChannelTag {
    MOBILE = 'Mobile',
    CP = 'CP'
}

export enum MongoSourceTag {
    MOBILEAPP = 'Mobile App',
}

export enum EventsName {
    PayNowClicked = 'PayNowClicked',
    PaymentListCount = 'PaymentListCount'
}

export enum MongoAMCStaging {
    Pending ='pending',
    Done = 'done'
}
