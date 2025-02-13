/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentEntity } from 'src/domain'
import { Content } from './content.entity'

export class ContentMapper {
  static toEntity(data: Content): ContentEntity {
    return new ContentEntity(
      data.id,
      data.company.id,
      data.title,
      data.type as any,
      data.url,
      data.total_likes,
      data.created_at,
      data.updated_at,
      data.deleted_at,
      data.cover,
      data.description,
    )
  }

  static toEntityList(data: any[]): ContentEntity[] {
    return data.length ? data.map((item) => this.toEntity(item)) : []
  }
}
