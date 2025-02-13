/* eslint-disable @typescript-eslint/no-unused-vars */
import { InternalServerErrorException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import {
  User,
  UserMapper,
  UserRepositoryImpl,
} from 'src/infrastructure/database/typeORM/entities/user'
import { DataSource } from 'typeorm'

describe('UserRepositoryImpl', () => {
  let userRepository: UserRepositoryImpl
  let dataSource: DataSource

  const dummyEntityManager = {
    connection: {
      getMetadata: jest.fn().mockReturnValue({ name: 'User', columns: [] }),
    },
  }

  const dummyDataSource = {
    createEntityManager: jest.fn().mockReturnValue(dummyEntityManager),
  } as unknown as DataSource

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepositoryImpl,
        {
          provide: DataSource,
          useValue: dummyDataSource,
        },
      ],
    }).compile()

    userRepository = module.get<UserRepositoryImpl>(UserRepositoryImpl)
    dataSource = module.get<DataSource>(DataSource)
  })

  describe('integration findById', () => {
    it('should return a UserEntity when a user is found', async () => {
      const user = new User()

      const userId = '1'
      user.id = userId
      user.name = 'John Doe'

      user.company = { id: '1', name: 'Company A' } as any

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user)

      const result = await userRepository.findById(userId)

      expect(result).toEqual(UserMapper.toEntity(user))
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['company'],
      })
    })

    it('should return null when no user is found', async () => {
      const userId = '1'

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null)

      const result = await userRepository.findById(userId)

      expect(result).toBeNull()
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['company'],
      })
    })

    it('should throw InternalServerErrorException when invalid uuid is provided', async () => {
      const userId = '1'

      jest
        .spyOn(userRepository, 'findOne')
        .mockRejectedValue(
          new InternalServerErrorException(`invalid input syntax for type uuid: ${userId}`),
        )

      await expect(userRepository.findById(userId)).rejects.toThrow(
        `invalid input syntax for type uuid: ${userId}`,
      )

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['company'],
      })
    })
  })
})
