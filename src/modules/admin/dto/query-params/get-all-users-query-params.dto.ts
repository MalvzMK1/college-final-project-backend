import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { UserTypesEnum } from "src/shared/enum";

export class GetAllUsersQueryParamsDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserTypesEnum)
  @IsOptional()
  @Type(() => Number)
  userTypeId?: UserTypesEnum;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  skip: number = 0;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  take: number = 10;
}
