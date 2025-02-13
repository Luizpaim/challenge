import { ContentEntity } from './content.entity'
import { UserEntity } from './user.entity'

export class CompanyEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly users: UserEntity[],
    public readonly contents: ContentEntity[],
  ) {}
}
