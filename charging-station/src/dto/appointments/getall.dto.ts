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