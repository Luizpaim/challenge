import { Logger, UseGuards } from '@nestjs/common'
import { Resolver, Args, Context, Query } from '@nestjs/graphql'
import { ProvisionUseCase } from 'src/application/use-cases'
import { ProvisionDto } from 'src/shared/dto/provision.dto'
import { AuthMiddleware } from '../middlewares'

@Resolver()
export class ContentResolver {
  private readonly logger = new Logger(ContentResolver.name)

  constructor(private readonly provisionUseCase: ProvisionUseCase) {}

  @UseGuards(AuthMiddleware)
  @Query(() => ProvisionDto)
  public async provision(
    @Args('content_id') contentId: string,
    @Context('req') req,
  ): Promise<ProvisionDto> {
    try {
      this.logger.log(`Provisioning content=${contentId} to user=${req.user.id}`)
      return this.provisionUseCase.execute({ contentId, companyId: req.user.companyId })
    } catch (error) {
      this.logger.error(`Error while provisioning content: ${error.message}`)
      throw error
    }
  }
}
