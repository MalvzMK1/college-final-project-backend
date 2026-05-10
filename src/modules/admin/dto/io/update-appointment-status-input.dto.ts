import { AppointmentStatusEnum } from "src/shared/enum/appointment-status.enum";

export interface UpdateAppointmentStatusInputDTO {
  barberId: string;
  appointmentId: number;
  statusId: AppointmentStatusEnum;
}
