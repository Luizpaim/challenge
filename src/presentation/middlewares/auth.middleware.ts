import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import * as jwt from 'jsonwebtoken'
import { UserFindByIdUseCase } from 'src/application/use-cases'

@Injectable()
export class AuthMiddleware implements CanActivate {
  constructor(private readonly userFindByIdUseCase: UserFindByIdUseCase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Unauthorized access.')
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('Token is missing.')
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { user_id: string }

      const user = await this.userFindByIdUseCase.execute(decoded.user_id)

      req['user'] = user
      return true
    } catch (error) {
      throw new UnauthorizedException(`Unauthorized access. Error: ${error.message}`)
    }
  }
}
