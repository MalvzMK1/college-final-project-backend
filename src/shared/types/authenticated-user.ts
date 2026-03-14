import { UserTypesEnum } from "../enum";

export type AuthenticatedUser = {
  id: string;
  roleId: UserTypesEnum;
}
