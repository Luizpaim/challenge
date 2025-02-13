import { ContentEntity, TypeContentEnum } from 'src/domain'

describe('Unit ContentEntity', () => {
  it('should create a valid instance of ContentEntity', () => {
    const now = new Date()

    const content = new ContentEntity(
      '1',
      'company-123',
      'Título do Conteúdo',
      TypeContentEnum.VIDEO,
      'https://example.com/video.mp4',
      100,
      now,
      now,
      null,
      'https://example.com/cover.jpg',
      'Descrição do conteúdo',
    )

    expect(content.id).toBe('1')
    expect(content.companyId).toBe('company-123')
    expect(content.title).toBe('Título do Conteúdo')
    expect(content.type).toBe(TypeContentEnum.VIDEO)
    expect(content.url).toBe('https://example.com/video.mp4')
    expect(content.totalLikes).toBe(100)
    expect(content.createdAt).toBe(now)
    expect(content.updatedAt).toBe(now)
    expect(content.deletedAt).toBeNull()
    expect(content.cover).toBe('https://example.com/cover.jpg')
    expect(content.description).toBe('Descrição do conteúdo')
  })
})
