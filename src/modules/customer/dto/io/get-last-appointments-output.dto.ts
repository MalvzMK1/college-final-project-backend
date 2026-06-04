export type GetLastAppointmentsOutputDTO = {
  id: number;
  dateTime: Date;
  createdAt: Date;
  barberName: string;
  status: {
    id: number;
    name: string;
  };
}[]
