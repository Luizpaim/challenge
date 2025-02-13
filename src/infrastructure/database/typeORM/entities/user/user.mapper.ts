/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserEntity } from 'src/domain'

export class UserMapper {
  static toEntity(data: any): UserEntity {
    return new UserEntity(data.id, data.name, data.email, data.password, data.role, data.company.id)
  }

  static toEntityList(data: any[]): UserEntity[] {
    return data.length ? data.map((item) => this.toEntity(item)) : []
  }
}
