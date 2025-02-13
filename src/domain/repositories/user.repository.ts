import { UserEntity } from '../entities'

export interface UserRepository {
  findById(id: string): Promise<UserEntity>
}
