import { ContentEntity } from 'src/domain'
import { ContentRepository } from 'src/domain/repositories/content.repository'
import { DataSource, Repository } from 'typeorm'
import { Content } from './content.entity'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ContentMapper } from './content.mapper'

@Injectable()
export class ContentRepositoryImpl extends Repository<Content> implements ContentRepository {
  constructor(private readonly dataSource: DataSource) {
    super(Content, dataSource.createEntityManager())
  }
  public async findByIdAndCompanyId({
    contentId,
    companyId,
  }: {
    contentId: string
    companyId: string
  }): Promise<ContentEntity> {
    try {
      const data = await this.createQueryBuilder('content')
        .innerJoinAndSelect('content.company', 'company')
        .where('content.id = :id', { id: contentId })
        .andWhere('content.company_id = :company_id', { company_id: companyId })
        .andWhere('content.deleted_at IS NULL')
        .getOne()

      return data ? ContentMapper.toEntity(data) : null
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
