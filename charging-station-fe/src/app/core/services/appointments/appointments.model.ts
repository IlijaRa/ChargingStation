export class AppointmentSaveDto {
    _id?: string
    startDate?: Date;
    endDate?: Date;
    isAvailable?: boolean;
    chargerId?: string;
}

export class AppointmentGetByIdDto {
    id?: string;
    startDate?: string;
    endDate?: string;
    isAvailable?: boolean;
    chargerId?: string;
}

export class AppointmentGetAllDto {
    items?: AppointmentGetAllItemDto[];
}

export class AppointmentGetAllItemDto {
    id?: string;
    startDate?: string;
    endDate?: string;
    isAvailable?: boolean;
    chargerId?: string;
}