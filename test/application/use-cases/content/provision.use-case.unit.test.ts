import { Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { ProvisionUseCase } from 'src/application/use-cases'
import { ContentRepository, ContentEntity, TypeContentEnum } from 'src/domain'
import { ContentFactory } from 'src/domain/factories/content/content.factory'
import { ProvisionDto } from 'src/shared/dto/provision.dto'

jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {})
jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {})
jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {})

describe('Unit ProvisionUseCase', () => {
  let provisionUseCase: ProvisionUseCase
  let contentRepository: jest.Mocked<ContentRepository>

  beforeEach(() => {
    contentRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ContentRepository>

    provisionUseCase = new ProvisionUseCase(contentRepository)
  })

  it('should throw an error if contentId is invalid', async () => {
    await expect(provisionUseCase.execute({ companyId: '12313', contentId: null })).rejects.toThrow(
      UnprocessableEntityException,
    )

    expect(contentRepository.findByIdAndCompanyId).toBeUndefined()
  })

  it('should throw an error if the content is not found', async () => {
    contentRepository.findByIdAndCompanyId = jest.fn().mockResolvedValue(null)

    await expect(
      provisionUseCase.execute({ companyId: '123', contentId: 'company-123' }),
    ).rejects.toThrow(NotFoundException)

    expect(contentRepository.findByIdAndCompanyId).toHaveBeenCalledWith({
      companyId: '123',
      contentId: 'company-123',
    })
  })

  it('should provision content correctly', async () => {
    const mockContent = new ContentEntity(
      '1',
      'company-123',
      'Test Content',
      TypeContentEnum.PDF,
      'https://example.com/file.pdf',
      100,
      new Date(),
      new Date(),
      null,
    )

    const mockProvisionDto: ProvisionDto = {
      id: mockContent.id,
      title: mockContent.title,
      cover: mockContent.cover,
      created_at: mockContent.createdAt,
      description: mockContent.description,
      total_likes: mockContent.totalLikes,
      type: mockContent.type,
      url: mockContent.url,
      allow_download: true,
      is_embeddable: false,
      format: 'pdf',
      bytes: 1234,
      metadata: {},
    }

    contentRepository.findByIdAndCompanyId = jest.fn().mockResolvedValue(mockContent)

    jest.spyOn(ContentFactory, 'create').mockReturnValue(mockProvisionDto)

    const result = await provisionUseCase.execute({ contentId: '1', companyId: 'company-123' })

    expect(contentRepository.findByIdAndCompanyId).toHaveBeenCalledWith({
      contentId: '1',
      companyId: 'company-123',
    })
    expect(ContentFactory.create).toHaveBeenCalledWith(mockContent)
    expect(result).toEqual(mockProvisionDto)
  })
})
