import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from 'src/infrastructure/database/database.module'
import { CompanyRepositoryImpl } from 'src/infrastructure/database/typeORM/entities/company/company.repository'
import { ContentRepositoryImpl } from 'src/infrastructure/database/typeORM/entities/content/content.repository'
import { UserRepositoryImpl } from 'src/infrastructure/database/typeORM/entities/user'

import { DataSource } from 'typeorm'

describe('Integration DatabaseModule', () => {
  let module: TestingModule
  let dataSource: DataSource

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile()

    dataSource = module.get<DataSource>(DataSource)
  })

  afterAll(async () => {
    await module.close()
  })

  it('should load the module correctly', () => {
    expect(module).toBeDefined()
  })

  it('should be connected to the database', async () => {
    expect(dataSource.isInitialized).toBe(true)
  })

  it('should inject the repositories correctly', () => {
    const userRepository = module.get<UserRepositoryImpl>('UserRepository')
    const contentRepository = module.get<ContentRepositoryImpl>('ContentRepository')
    const companyRepository = module.get<CompanyRepositoryImpl>('CompanyRepository')

    expect(userRepository).toBeDefined()
    expect(contentRepository).toBeDefined()
    expect(companyRepository).toBeDefined()
  })
})
