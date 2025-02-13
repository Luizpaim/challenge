import { DataSource, Repository } from 'typeorm'

import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { UserEntity, UserRepository } from 'src/domain'
import { User } from './user.entity'
import { UserMapper } from './user.mapper'

@Injectable()
export class UserRepositoryImpl extends Repository<User> implements UserRepository {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager())
  }
  public async findById(id: string): Promise<UserEntity> {
    try {
      const data = await this.findOne({
        where: { id },
        relations: ['company'],
      })
      return data ? UserMapper.toEntity(data) : null
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
