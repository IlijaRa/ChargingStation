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