import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'

import { ContentRepository } from 'src/domain'
import { ContentFactory } from 'src/domain/factories/content/content.factory'
import { ProvisionDto } from 'src/shared/dto/provision.dto'

@Injectable()
export class ProvisionUseCase {
  private readonly logger = new Logger(ProvisionUseCase.name)

  constructor(
    @Inject('ContentRepository')
    private readonly contentRepository: ContentRepository,
  ) {}

  public async execute({
    contentId,
    companyId,
  }: {
    contentId: string
    companyId: string
  }): Promise<ProvisionDto> {
    if (!contentId) {
      this.logger.error(`Invalid Content ID: ${contentId}`)
      throw new UnprocessableEntityException(`Content ID is invalid: ${contentId}`)
    }

    this.logger.log(`Provisioning content for id=${contentId}`)

    const content = await this.contentRepository.findByIdAndCompanyId({ contentId, companyId })

    if (!content) {
      this.logger.warn(`Content not found for id=${contentId}`)
      throw new NotFoundException(`Content not found: ${contentId}`)
    }

    const contentType = ContentFactory.create(content)

    return contentType
  }
}
