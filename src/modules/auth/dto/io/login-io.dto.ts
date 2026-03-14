import { UserTypesEnum } from "src/shared/enum";

export type LoginInputDTO = {
  email: string;
  password: string;
};

export type LoginOutputDTO = {
  token: string;
  userTypeId: UserTypesEnum;
};
