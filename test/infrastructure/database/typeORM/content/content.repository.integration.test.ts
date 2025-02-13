/* eslint-disable @typescript-eslint/no-unused-vars */
import { InternalServerErrorException } from '@nestjs/common'
import { TestingModule, Test } from '@nestjs/testing'
import { ContentEntity } from 'src/domain'
import { Content } from 'src/infrastructure/database/typeORM/entities/content/content.entity'
import { ContentMapper } from 'src/infrastructure/database/typeORM/entities/content/content.mapper'
import { ContentRepositoryImpl } from 'src/infrastructure/database/typeORM/entities/content/content.repository'
import { DataSource } from 'typeorm'

const dummyEntityManager = {
  connection: {
    getMetadata: jest.fn().mockReturnValue({ name: 'Content', columns: [] }),
  },
}

const dummyDataSource = {
  createEntityManager: jest.fn().mockReturnValue(dummyEntityManager),
} as unknown as DataSource

describe('Integration ContentRepositoryImpl', () => {
  let contentRepository: ContentRepositoryImpl
  let dataSource: DataSource

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentRepositoryImpl,
        {
          provide: DataSource,
          useValue: dummyDataSource,
        },
      ],
    }).compile()

    contentRepository = module.get<ContentRepositoryImpl>(ContentRepositoryImpl)
    dataSource = module.get<DataSource>(DataSource)
  })

  describe('integration findById', () => {
    it('should return a ContentEntity when content is found', async () => {
      const content: Content = {
        id: '1',
        title: 'Sample Content',
        description: 'Test Description',
        url: 'http://localhost:3000/uploads/dummy.pdf',
        created_at: new Date('2025-01-31T23:39:54.236Z'),
        total_likes: 10,
        type: 'pdf',
        deleted_at: null,
        company: { id: 'company1', name: 'Company A' } as any,
      } as Content

      const fakeQueryBuilder = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(content),
      }

      jest.spyOn(contentRepository, 'createQueryBuilder').mockReturnValue(fakeQueryBuilder as any)

      const result: ContentEntity = await contentRepository.findByIdAndCompanyId({
        companyId: 'company1',
        contentId: '1',
      })

      expect(fakeQueryBuilder.innerJoinAndSelect).toHaveBeenCalledWith('content.company', 'company')
      expect(fakeQueryBuilder.where).toHaveBeenCalledWith('content.id = :id', { id: '1' })
      expect(fakeQueryBuilder.andWhere).toHaveBeenCalledWith('content.company_id = :company_id', {
        company_id: 'company1',
      })
      expect(fakeQueryBuilder.andWhere).toHaveBeenCalledWith('content.deleted_at IS NULL')
      expect(fakeQueryBuilder.getOne).toHaveBeenCalled()

      expect(result).toEqual(ContentMapper.toEntity(content))
    })

    it('should return null when no content is found', async () => {
      const fakeQueryBuilder = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }

      jest.spyOn(contentRepository, 'createQueryBuilder').mockReturnValue(fakeQueryBuilder as any)

      const result: ContentEntity = await contentRepository.findByIdAndCompanyId({
        companyId: 'company1',
        contentId: 'non-existent-id',
      })

      expect(fakeQueryBuilder.innerJoinAndSelect).toHaveBeenCalledWith('content.company', 'company')
      expect(fakeQueryBuilder.where).toHaveBeenCalledWith('content.id = :id', {
        id: 'non-existent-id',
      })
      expect(fakeQueryBuilder.andWhere).toHaveBeenCalledWith('content.company_id = :company_id', {
        company_id: 'company1',
      })
      expect(fakeQueryBuilder.andWhere).toHaveBeenCalledWith('content.deleted_at IS NULL')
      expect(fakeQueryBuilder.getOne).toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('should throw InternalServerErrorException when invalid uuid is provided', async () => {
      const fakeQueryBuilder = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis().mockReturnThis(),
        getOne: jest
          .fn()
          .mockRejectedValue(
            new InternalServerErrorException(`invalid input syntax for type uuid: non-existent-id`),
          ),
      }

      jest.spyOn(contentRepository, 'createQueryBuilder').mockReturnValue(fakeQueryBuilder as any)

      await expect(
        contentRepository.findByIdAndCompanyId({
          companyId: 'company1',
          contentId: 'non-existent-id',
        }),
      ).rejects.toThrow(`invalid input syntax for type uuid: non-existent-id`)

      expect(fakeQueryBuilder.innerJoinAndSelect).toHaveBeenCalledWith('content.company', 'company')
      expect(fakeQueryBuilder.where).toHaveBeenCalledWith('content.id = :id', {
        id: 'non-existent-id',
      })
      expect(fakeQueryBuilder.andWhere).toHaveBeenCalledWith('content.company_id = :company_id', {
        company_id: 'company1',
      })
      expect(fakeQueryBuilder.andWhere).toHaveBeenCalledWith('content.deleted_at IS NULL')
      expect(fakeQueryBuilder.getOne).toHaveBeenCalled()
    })
  })
})
