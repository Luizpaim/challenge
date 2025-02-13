import { ContentEntity } from '../entities'

export interface ContentRepository {
  findByIdAndCompanyId(params: { contentId: string; companyId: string }): Promise<ContentEntity>
}
