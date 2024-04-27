export class AppointmentSaveDto {
    _id?: string
    startTime?: Date;
    endTime?: Date;
    isAvailable?: boolean;
    isAllowed?: boolean;
    chargerId?: string;
}

export class AppointmentGetByIdDto {
    id?: string;
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
    isAllowed?: boolean;
    chargerId?: string;
}

export class AppointmentGetAllDto {
    items?: AppointmentGetAllItemDto[];
}

export class AppointmentGetAllItemDto {
    id?: string;
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
    isAllowed?: boolean;
    chargerId?: string;
}

export class AppointmentAllowDto {
    appointmentId?: string;
    chargerId?: string;
}

export class AppointmentUnallowDto {
    appointmentId?: string;
    chargerId?: string;
}