import { BadRequestException } from '@nestjs/common'
import { TypeContentEnum, ContentEntity } from 'src/domain'
import { ContentFactory } from 'src/domain/factories/content/content.factory'
import * as fs from 'fs'
import { ProvisionDto } from 'src/shared/dto/provision.dto'

describe('Unit ContentFactory', () => {
  jest.mock('fs')

  describe('ContentFactory - calculateFileSize', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should return 0 if the URL is undefined', () => {
      const spy = jest.spyOn(fs, 'existsSync').mockReturnValue(false)

      const result = (ContentFactory as any).calculateFileSize(undefined)

      expect(result).toBe(0)
      expect(spy).not.toHaveBeenCalled()
    })

    it('should return 0 if the file does not exist', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false)

      const result = (ContentFactory as any).calculateFileSize('invalid/path/file.pdf')

      expect(result).toBe(0)
    })

    it('should return the correct size of the file if it exists', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true)
      jest.spyOn(fs, 'statSync').mockReturnValue({ size: 12345 } as fs.Stats)

      const result = (ContentFactory as any).calculateFileSize('valid/path/file.pdf')

      expect(result).toBe(12345)
    })
  })

  describe('ContentFactory - generateSignedUrl', () => {
    const mockOriginalUrl = 'https://example.com/resource'

    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(new Date('2024-02-01T12:00:00Z').getTime())
      jest.spyOn(global.Math, 'random').mockReturnValue(0.5)
    })

    afterAll(() => {
      jest.useRealTimers()
      jest.spyOn(global.Math, 'random').mockRestore()
    })

    it('should generate a correctly signed URL', () => {
      const expirationTime = 3600 // 1 hora
      const result = (ContentFactory as any).generateSignedUrl({
        originalUrl: mockOriginalUrl,
        expirationTime,
      })

      expect(result.includes('expires')).toBeTruthy()
      expect(result.includes('signature')).toBeTruthy()
    })

    it('should return undefined if originalUrl is invalid', () => {
      const result = (ContentFactory as any).generateSignedUrl({
        originalUrl: '',
        expirationTime: 3600,
      })
      expect(result).toBeUndefined()
    })

    it('should return undefined if expirationTime is invalid', () => {
      const result = (ContentFactory as any).generateSignedUrl({
        originalUrl: mockOriginalUrl,
        expirationTime: 0,
      })
      expect(result).toBeUndefined()
    })
  })

  describe('ContentFactory - create', () => {
    const mockContent = (
      type: TypeContentEnum,
      url = 'https://example.com/file.pdf',
    ): ContentEntity => {
      return new ContentEntity(
        '1',
        'company-123',
        `Test ${type}`,
        type,
        url,
        100,
        new Date(),
        new Date(),
        null,
        'https://example.com/cover.jpg',
        'Description',
      )
    }

    it('should create a valid ProvisionDto for TXT', () => {
      const content = mockContent(TypeContentEnum.TEXT)
      const provision: ProvisionDto = ContentFactory.create(content)

      expect(provision.id).toBe(content.id)
      expect(provision.type).toBe(TypeContentEnum.TEXT)
      expect(provision.allow_download).toBe(true)
      expect(provision.is_embeddable).toBe(false)
      expect(provision.format).toBe(TypeContentEnum.TEXT)
      expect(provision.metadata).toHaveProperty('pages')
    })

    it('should create a valid ProvisionDto for TEXT, however, passing the url as an empty string', () => {
      const content = mockContent(TypeContentEnum.TEXT, '')
      const provision: ProvisionDto = ContentFactory.create(content)
      expect(provision.url).toBeUndefined()
    })

    it('should create a valid ProvisionDto for PDF', () => {
      const content = mockContent(TypeContentEnum.PDF)
      const provision: ProvisionDto = ContentFactory.create(content)

      expect(provision.id).toBe(content.id)
      expect(provision.type).toBe(TypeContentEnum.PDF)
      expect(provision.allow_download).toBe(true)
      expect(provision.is_embeddable).toBe(false)
      expect(provision.format).toBe(TypeContentEnum.PDF)
      expect(provision.metadata).toHaveProperty('pages')
    })

    it('should create a valid ProvisionDto for PDF, however, passing the url as an empty string', () => {
      const content = mockContent(TypeContentEnum.PDF, '')
      const provision: ProvisionDto = ContentFactory.create(content)
      expect(provision.url).toBeUndefined()
    })

    it('should create a valid ProvisionDto for IMAGE', () => {
      const content = mockContent(TypeContentEnum.IMAGE, 'https://example.com/image.jpg')
      const provision: ProvisionDto = ContentFactory.create(content)

      expect(provision.type).toBe(TypeContentEnum.IMAGE)
      expect(provision.allow_download).toBe(true)
      expect(provision.is_embeddable).toBe(true)
      expect(provision.format).toBe('jpg')
      expect(provision.metadata).toHaveProperty('resolution')
    })

    it('should create a valid ProvisionDto for IMAGE with an empty url', () => {
      const content = mockContent(TypeContentEnum.IMAGE, '')
      const provision: ProvisionDto = ContentFactory.create(content)

      expect(provision.format).toBe('jpg')
    })

    it('should create a valid ProvisionDto for IMAGE with a png url', () => {
      const content = mockContent(TypeContentEnum.IMAGE, 'https://example.com/image.png')
      const provision: ProvisionDto = ContentFactory.create(content)

      expect(provision.format).toBe('png')
    })

    it('should create a valid ProvisionDto for VIDEO', () => {
      const content = mockContent(TypeContentEnum.VIDEO, 'https://example.com/video.mp4')
      const provision: ProvisionDto = ContentFactory.create(content)

      expect(provision.type).toBe(TypeContentEnum.VIDEO)
      expect(provision.allow_download).toBe(false)
      expect(provision.is_embeddable).toBe(true)
      expect(provision.format).toBe('mp4')
      expect(provision.metadata).toHaveProperty('duration')
    })

    it('should create a valid ProvisionDto for VIDEO with an empty url', () => {
      const content = mockContent(TypeContentEnum.VIDEO, '')
      const provision: ProvisionDto = ContentFactory.create(content)

      expect(provision.format).toBe('mp4')
    })

    it('should create a valid ProvisionDto for VIDEO with a different url', () => {
      const content = mockContent(TypeContentEnum.VIDEO, 'https://example.com/video.mkv')
      const provision: ProvisionDto = ContentFactory.create(content)

      expect(provision.format).toBe('mkv')
    })

    it('should create a valid ProvisionDto for LINK', () => {
      const content = mockContent(TypeContentEnum.LINK, 'https://example.com')
      const provision: ProvisionDto = ContentFactory.create(content)

      expect(provision.type).toBe(TypeContentEnum.LINK)
      expect(provision.allow_download).toBe(false)
      expect(provision.is_embeddable).toBe(true)
      expect(provision.format).toBeNull()
      expect(provision.metadata).toHaveProperty('trusted')
    })

    it('should create a valid ProvisionDto for LINK with empty url', () => {
      const content = mockContent(TypeContentEnum.LINK, '')
      const provision: ProvisionDto = ContentFactory.create(content)

      expect(provision.type).toBe(TypeContentEnum.LINK)
      expect(provision.allow_download).toBe(false)
      expect(provision.is_embeddable).toBe(true)
      expect(provision.format).toBeFalsy()
      expect(provision.metadata).toHaveProperty('trusted')
    })

    it('should throw an error for unsupported content type', () => {
      const content = mockContent('invalid-type' as TypeContentEnum)
      expect(() => ContentFactory.create(content)).toThrow(BadRequestException)
    })
  })
})
