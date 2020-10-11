export interface AlertInterface {
    title?: string
    message?: string
    cancelText?: string
    successText?: string
    type?: string
    value? : string
    placeholder?: string
    cssClass?: string;
    enableBackdropDismiss?: boolean;
}