import { UserEntity } from 'src/domain'
import { UserMapper } from 'src/infrastructure/database/typeORM/entities/user'

describe('Integration UserMapper', () => {
  it('should map an object to UserEntity', () => {
    const rawData = {
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'securepassword',
      role: 'admin',
      company: { id: '10' },
    }

    const entity = UserMapper.toEntity(rawData)

    expect(entity).toBeInstanceOf(UserEntity)
    expect(entity.id).toBe('1')
    expect(entity.name).toBe('John Doe')
    expect(entity.email).toBe('johndoe@example.com')
    expect(entity.password).toBe('securepassword')
    expect(entity.role).toBe('admin')
    expect(entity.companyId).toBe('10')
  })

  it('should map a list of objects to a list of UserEntity', () => {
    const rawDataList = [
      {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'securepassword',
        role: 'admin',
        company: { id: '10' },
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: 'securepassword',
        role: 'user',
        company: { id: '20' },
      },
    ]

    const entityList = UserMapper.toEntityList(rawDataList)

    expect(entityList).toHaveLength(2)
    expect(entityList[0]).toBeInstanceOf(UserEntity)
    expect(entityList[0].id).toBe('1')
    expect(entityList[1].id).toBe('2')
  })

  it('should return an empty list when no data is passed', () => {
    const entityList = UserMapper.toEntityList([])

    expect(entityList).toEqual([])
  })
})
