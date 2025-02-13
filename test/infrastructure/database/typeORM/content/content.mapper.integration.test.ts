import { ContentEntity } from 'src/domain'
import { Content } from 'src/infrastructure/database/typeORM/entities/content/content.entity'
import { ContentMapper } from 'src/infrastructure/database/typeORM/entities/content/content.mapper'

describe('Integration ContentMapper', () => {
  const mockContent: Content = {
    id: '123',
    company: {} as any,
    title: 'Test Content',
    type: 'article',
    url: 'https://example.com',
    total_likes: 100,
    created_at: new Date('2024-02-10T12:00:00Z'),
    updated_at: new Date('2024-02-11T12:00:00Z'),
    deleted_at: null,
    cover: 'https://example.com/cover.jpg',
    description: 'This is a test content',
  }

  it('should correctly map a Content object to ContentEntity', () => {
    const entity = ContentMapper.toEntity(mockContent)

    expect(entity).toBeInstanceOf(ContentEntity)
    expect(entity.id).toBe(mockContent.id)
    expect(entity.companyId).toBe(mockContent.company.id)
    expect(entity.title).toBe(mockContent.title)
    expect(entity.type).toBe(mockContent.type)
    expect(entity.url).toBe(mockContent.url)
    expect(entity.totalLikes).toBe(mockContent.total_likes)
    expect(entity.createdAt).toEqual(mockContent.created_at)
    expect(entity.updatedAt).toEqual(mockContent.updated_at)
    expect(entity.deletedAt).toBeNull()
    expect(entity.cover).toBe(mockContent.cover)
    expect(entity.description).toBe(mockContent.description)
  })

  it('should correctly map a list of Content objects to a list of ContentEntities', () => {
    const entityList = ContentMapper.toEntityList([mockContent, mockContent])

    expect(entityList).toHaveLength(2)
    entityList.forEach((entity) => {
      expect(entity).toBeInstanceOf(ContentEntity)
      expect(entity.id).toBe(mockContent.id)
      expect(entity.companyId).toBe(mockContent.company.id)
    })
  })

  it('should return an empty array if the input list is empty', () => {
    const entityList = ContentMapper.toEntityList([])

    expect(entityList).toEqual([])
  })
})
