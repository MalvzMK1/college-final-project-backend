import { UserTypesEnum } from "src/shared/enum";

export type GetAllUsersOutputDTO = {
  users: {
    id: string;
    name: string;
    userTypeId: UserTypesEnum;
    scheduledAppointmentsAmmount: number;
    ownedAppointmentsAmmount: number;
  }[];
  totalCount: number;
}
