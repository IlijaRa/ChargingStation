export enum ViewState {
    Create, Edit, Details
}

export class ErrorModel {
    Messages?: string[];
}

export class Dictionary {
    [index: string]: any;
}

export class KeyValuePairDTO {
    key?: number;
    value?: string;
    visible: boolean = true;
}