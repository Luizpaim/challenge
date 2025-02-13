import { UserEntity, UserRepository } from 'src/domain'
import { NotFoundException, UnprocessableEntityException, Logger } from '@nestjs/common'
import { UserFindByIdUseCase } from 'src/application/use-cases'

jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {})
jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {})

describe('Unit UserFindByIdUseCase', () => {
  let userFindByIdUseCase: UserFindByIdUseCase
  let userRepository: jest.Mocked<UserRepository>

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>

    userFindByIdUseCase = new UserFindByIdUseCase(userRepository)
  })

  it('should throw an error if userId is invalid', async () => {
    await expect(userFindByIdUseCase.execute('')).rejects.toThrow(UnprocessableEntityException)
    expect(userRepository.findById).not.toHaveBeenCalled()
  })

  it('should throw an error if the user is not found', async () => {
    userRepository.findById.mockResolvedValue(null)

    await expect(userFindByIdUseCase.execute('123')).rejects.toThrow(NotFoundException)
    expect(userRepository.findById).toHaveBeenCalledWith('123')
  })

  it('should find a user correctly', async () => {
    const mockUser = new UserEntity(
      '1',
      'John Doe',
      'john@example.com',
      'hashedpassword',
      'admin',
      'company-123',
    )

    userRepository.findById.mockResolvedValue(mockUser)

    const result = await userFindByIdUseCase.execute('1')

    expect(userRepository.findById).toHaveBeenCalledWith('1')
    expect(result).toEqual(mockUser)
  })
})
