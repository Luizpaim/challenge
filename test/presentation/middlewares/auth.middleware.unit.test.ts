import { UserFindByIdUseCase } from 'src/application/use-cases'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import * as jwt from 'jsonwebtoken'
import { UserEntity } from 'src/domain/entities'
import { AuthMiddleware } from 'src/presentation'

jest.mock('jsonwebtoken')

describe('Unit AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware
  let userFindByIdUseCase: jest.Mocked<UserFindByIdUseCase>
  let mockExecutionContext: Partial<ExecutionContext>

  beforeEach(() => {
    userFindByIdUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UserFindByIdUseCase>

    authMiddleware = new AuthMiddleware(userFindByIdUseCase)

    mockExecutionContext = {
      switchToHttp: jest.fn(),
    }
  })

  const mockGraphQLContext = (authHeader?: string) => {
    return {
      getContext: () => ({
        req: {
          headers: {
            authorization: authHeader,
          },
        },
      }),
    }
  }

  it('should throw an error if the Authorization header is missing', async () => {
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGraphQLContext(undefined) as any)

    await expect(
      authMiddleware.canActivate(mockExecutionContext as ExecutionContext),
    ).rejects.toThrow(new UnauthorizedException('Unauthorized access.'))
  })

  it('should throw an error if the token is missing in the Authorization header', async () => {
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGraphQLContext('Bearer ') as any)

    await expect(
      authMiddleware.canActivate(mockExecutionContext as ExecutionContext),
    ).rejects.toThrow(new UnauthorizedException('Token is missing.'))
  })

  it('should throw an error if the token is invalid', async () => {
    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockGraphQLContext('Bearer invalid_token') as any)
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid token')
    })

    await expect(
      authMiddleware.canActivate(mockExecutionContext as ExecutionContext),
    ).rejects.toThrow(new UnauthorizedException('Unauthorized access. Error: Invalid token'))
  })

  it('should throw an error if the user is not found', async () => {
    const validToken = 'valid_token'
    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockGraphQLContext(`Bearer ${validToken}`) as any)
    jest.spyOn(jwt, 'verify').mockReturnValue({ user_id: '123' } as any)
    userFindByIdUseCase.execute.mockRejectedValue(new Error('User not found'))

    await expect(
      authMiddleware.canActivate(mockExecutionContext as ExecutionContext),
    ).rejects.toThrow(new UnauthorizedException('Unauthorized access. Error: User not found'))
  })

  it('should allow access when the token is valid and the user is found', async () => {
    const validToken = 'valid_token'
    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(mockGraphQLContext(`Bearer ${validToken}`) as any)
    jest.spyOn(jwt, 'verify').mockReturnValue({ user_id: '123' } as any)

    const mockUser = new UserEntity(
      '123',
      'John Doe',
      'john@example.com',
      'hashedpassword',
      'admin',
      'company-123',
    )
    userFindByIdUseCase.execute.mockResolvedValue(mockUser)

    const result = await authMiddleware.canActivate(mockExecutionContext as ExecutionContext)

    expect(result).toBe(true)
    expect(userFindByIdUseCase.execute).toHaveBeenCalledWith('123')
  })
})
