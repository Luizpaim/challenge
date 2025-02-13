import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { UserEntity, UserRepository } from 'src/domain'

@Injectable()
export class UserFindByIdUseCase {
  private readonly logger = new Logger(UserFindByIdUseCase.name)

  constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

  public async execute(userId: string): Promise<UserEntity> {
    if (!userId) {
      this.logger.error(`Invalid user ID: ${userId}`)
      throw new UnprocessableEntityException(`User ID is invalid: ${userId}`)
    }

    const user = await this.userRepository.findById(userId)

    if (!user) {
      this.logger.error(`User not found: ${userId}`)
      throw new NotFoundException(`User not found: ${userId}`)
    }

    return user
  }
}
