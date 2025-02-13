import { Logger } from '@nestjs/common'
import 'reflect-metadata'

import { ProvisionUseCase } from 'src/application/use-cases'
import { ContentResolver, AuthMiddleware } from 'src/presentation'
import { ProvisionDto } from 'src/shared/dto/provision.dto'

describe('Unit ContentResolver', () => {
  let contentResolver: ContentResolver
  let provisionUseCase: jest.Mocked<ProvisionUseCase>

  beforeEach(() => {
    provisionUseCase = {
      execute: jest.fn(),
    } as any

    contentResolver = new ContentResolver(provisionUseCase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return a ProvisionDto when contentService.execute succeeds', async () => {
    const mockProvisionDto: ProvisionDto = {
      id: '1',
      title: 'Test Title',
      cover: 'https://example.com/cover.jpg',
      created_at: new Date(),
      description: 'Test description',
      total_likes: 100,
      type: 'pdf',
      url: 'https://example.com/file.pdf',
      allow_download: true,
      is_embeddable: false,
      format: 'pdf',
      bytes: 1234,
      metadata: {},
    }

    provisionUseCase.execute.mockResolvedValue(mockProvisionDto)
    const req = { user: { id: '123' } }

    const loggerLogSpy = jest.spyOn((contentResolver as any).logger, 'log')

    const result = await contentResolver.provision('1', req)

    expect(result).toEqual(mockProvisionDto)
    expect(provisionUseCase.execute).toHaveBeenCalledWith({ companyId: undefined, contentId: '1' })
    expect(loggerLogSpy).toHaveBeenCalledWith('Provisioning content=1 to user=123')
  })

  it('should throw an Error if contentService.execute throws an error', async () => {
    const error = new Error('Some error')

    provisionUseCase.execute.mockImplementation(() => {
      throw error
    })
    const req = { user: { id: '123' } }

    const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error')

    await expect(contentResolver.provision('1', req)).rejects.toThrow('Some error')
    expect(loggerErrorSpy).toHaveBeenCalledWith('Error while provisioning content: Some error')
  })

  it('should have AuthMiddleware applied via UseGuards', () => {
    const guards = Reflect.getMetadata('__guards__', ContentResolver.prototype.provision)
    expect(guards).toBeDefined()
    expect(guards).toContain(AuthMiddleware)
  })
})
