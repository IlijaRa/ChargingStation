export class UserGetAllDto {
    items?: UserGetAllItemDto[];
}

export class UserGetAllItemDto {
    id?: string;
    firstName?: string;
    lastName?: string;
    biography?: string;
    username?: string;
    gender?: string;
    isBlocked?: boolean;
    isConfirmed?: boolean;
}

export class UserAllDto {
    items?: UserAllItemDto[];
}

export class UserAllItemDto {
    id?: string;
    fullName?: string;
}