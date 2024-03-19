export class UserGetByIdDto {
    id?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    username?: string;
    emailAddress?: string;
    role?: string;
    isBlocked?: boolean;
    isConfirmed?: boolean;
}

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