export class AppointmentGetByIdDto {
    id?: string;
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
    isAllowed?: boolean;
    chargerId?: string;
}