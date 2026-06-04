export interface GetWeekAppointmentsOutputDTO {
  id: number;
  note: string | null;
  dateTime: Date;
  customerName: string;
  status: {
    id: number;
    name: string;
  } | null;
}
