import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { UserTypesEnum } from "src/shared/enum";

export class GetAllUsersQueryParamsDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserTypesEnum)
  @IsOptional()
  userTypeId?: UserTypesEnum;

  @IsInt()
  @IsOptional()
  skip: number = 0;

  @IsInt()
  @IsOptional()
  take: number = 10;
}
