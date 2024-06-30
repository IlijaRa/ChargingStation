export class AppointmentAllDto {
    items?: AppointmentAllItemDto[];
}

export class AppointmentAllItemDto {
    id?: string;
    startTime?: string;
    endTime?: string;
}