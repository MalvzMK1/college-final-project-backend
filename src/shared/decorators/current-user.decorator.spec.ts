import 'reflect-metadata';

import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { CurrentUser } from './current-user.decorator';
import { UserTypesEnum } from '../enum';

describe('CurrentUser Decorator', () => {
  function getParamDecoratorFactory(decorator: any) {
    class Test {
      public test(@decorator() _: any) {}
    }

    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
    return args[Object.keys(args)[0]].factory;
  }

  const mockUser = {
    id: '782e5b7d-654e-4f7f-856c-032f3074094a',
    roleId: UserTypesEnum.BARBER,
  };

  const mockExecutionContext = (user: any) => ({
    switchToHttp: () => ({
      getRequest: () => ({
        user,
      }),
    }),
  } as unknown as ExecutionContext);

  it('should return the full user object when no data is provided', () => {
    const factory = getParamDecoratorFactory(CurrentUser);
    const context = mockExecutionContext(mockUser);

    const result = factory(undefined, context);

    expect(result).toEqual(mockUser);
  });

  it('should return the user id when "id" is provided as data', () => {
    const factory = getParamDecoratorFactory(CurrentUser);
    const context = mockExecutionContext(mockUser);

    const result = factory('id', context);

    expect(result).toBe(mockUser.id);
  });

  it('should return the role id when "roleId" is provided as data', () => {
    const factory = getParamDecoratorFactory(CurrentUser);
    const context = mockExecutionContext(mockUser);

    const result = factory('roleId', context);

    expect(result).toBe(mockUser.roleId);
  });

  it('should return undefined if user is not present in request', () => {
    const factory = getParamDecoratorFactory(CurrentUser);
    const context = mockExecutionContext(undefined);

    const result = factory(undefined, context);

    expect(result).toBeUndefined();
  });

  it('should return undefined if property does not exist on user', () => {
    const factory = getParamDecoratorFactory(CurrentUser);
    const context = mockExecutionContext(mockUser);

    const result = factory('nonExistentProperty' as any, context);

    expect(result).toBeUndefined();
  });
});
