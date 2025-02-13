import { UserEntity } from 'src/domain'

describe('Unit UserEntity', () => {
  it('should create a valid instance of UserEntity', () => {
    const user = new UserEntity(
      '1',
      'John Doe',
      'john.doe@example.com',
      'hashedpassword',
      'admin',
      'company-123',
    )

    expect(user.id).toBe('1')
    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john.doe@example.com')
    expect(user.password).toBe('hashedpassword')
    expect(user.role).toBe('admin')
    expect(user.companyId).toBe('company-123')
  })
})
