import { UserEntity, ContentEntity, TypeContentEnum, CompanyEntity } from 'src/domain'

describe('Unit CompanyEntity', () => {
  it('should create a valid instance of CompanyEntity', () => {
    const users: UserEntity[] = [
      new UserEntity('1', 'John Doe', 'john@example.com', 'hashedpassword', 'admin', 'company-123'),
      new UserEntity('2', 'Jane Doe', 'jane@example.com', 'hashedpassword', 'user', 'company-123'),
    ]

    const contents: ContentEntity[] = [
      new ContentEntity(
        '1',
        'company-123',
        'Vídeo Tutorial',
        TypeContentEnum.VIDEO,
        'https://example.com/video.mp4',
        100,
        new Date(),
        new Date(),
        null,
      ),
      new ContentEntity(
        '2',
        'company-123',
        'Manual PDF',
        TypeContentEnum.PDF,
        'https://example.com/manual.pdf',
        50,
        new Date(),
        new Date(),
        null,
      ),
    ]

    const company = new CompanyEntity('company-123', 'TechCorp', users, contents)

    expect(company.id).toBe('company-123')
    expect(company.name).toBe('TechCorp')
    expect(company.users.length).toBe(2)
    expect(company.contents.length).toBe(2)
    expect(company.users[0].name).toBe('John Doe')
    expect(company.contents[1].type).toBe(TypeContentEnum.PDF)
  })
})
