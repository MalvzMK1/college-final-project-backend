import { UserTypesEnum } from "../enum";
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = 'Roles'
export const RequireRoles = (...roles: UserTypesEnum[]) => SetMetadata(ROLES_KEY, roles);
