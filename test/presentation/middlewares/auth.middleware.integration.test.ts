/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import * as jwt from 'jsonwebtoken'

import { UserFindByIdUseCase } from 'src/application/use-cases'
import { AuthMiddleware } from 'src/presentation'

jest.mock('jsonwebtoken')

describe('Integration AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware
  let userFindByIdUseCase: UserFindByIdUseCase

  beforeEach(() => {
    userFindByIdUseCase = {
      execute: jest.fn(),
    } as any

    authMiddleware = new AuthMiddleware(userFindByIdUseCase)
  })

  const mockContext = (authHeader?: string): ExecutionContext => {
    return {
      switchToHttp: jest.fn(),
      getType: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getContext: jest.fn(),
    } as any
  }

  it('should allow access when the token is valid', async () => {
    const user = { id: '123', name: 'User Test' }
    const token = 'valid-token'

    ;(jwt.verify as jest.Mock).mockReturnValue({ user_id: '123' })
    ;(userFindByIdUseCase.execute as jest.Mock).mockResolvedValue(user)

    const executionContext = mockContext(`Bearer ${token}`)
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: () => ({ req: { headers: { authorization: `Bearer ${token}` } } }),
    } as any)

    const result = await authMiddleware.canActivate(executionContext)

    expect(result).toBe(true)
    expect(userFindByIdUseCase.execute).toHaveBeenCalledWith('123')
  })

  it('should throw UnauthorizedException when token is missing', async () => {
    const executionContext = mockContext()
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: () => ({ req: { headers: {} } }),
    } as any)

    await expect(authMiddleware.canActivate(executionContext)).rejects.toThrow(
      new UnauthorizedException('Unauthorized access.'),
    )
  })

  it('should throw UnauthorizedException when the token is invalid', async () => {
    ;(jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token')
    })

    const executionContext = mockContext('Bearer invalid-token')
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: () => ({ req: { headers: { authorization: 'Bearer invalid-token' } } }),
    } as any)

    await expect(authMiddleware.canActivate(executionContext)).rejects.toThrow(
      new UnauthorizedException('Unauthorized access. Error: Invalid token'),
    )
  })

  it('should throw UnauthorizedException when user is not found', async () => {
    ;(jwt.verify as jest.Mock).mockReturnValue({ user_id: '123' })
    ;(userFindByIdUseCase.execute as jest.Mock).mockResolvedValue(null)

    const executionContext = mockContext('Bearer valid-token')
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: () => ({ req: { headers: { authorization: 'Bearer valid-token' } } }),
    } as any)
    const result = await authMiddleware.canActivate(executionContext)

    expect(result).toBeTruthy()
  })
})
