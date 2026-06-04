export interface GetWeekAppointmentsOutputDTO {
  id: number;
  dateTime: Date;
  customerName: string;
  status: {
    id: number;
    name: string;
  } | null;
}
