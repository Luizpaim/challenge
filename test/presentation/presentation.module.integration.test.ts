import { Test, TestingModule } from '@nestjs/testing'
import { ProvisionUseCase, UserFindByIdUseCase } from 'src/application/use-cases'
import { ResolverModule, ContentResolver, AuthMiddleware } from 'src/presentation'

describe('Integration ResolverModule', () => {
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ResolverModule],
    }).compile()
  })

  it('should create the expected module and providers', () => {
    expect(module).toBeDefined()

    const contentResolver = module.get<ContentResolver>(ContentResolver)
    expect(contentResolver).toBeDefined()

    const provisionUseCase = module.get<ProvisionUseCase>(ProvisionUseCase)
    expect(provisionUseCase).toBeDefined()

    const userFindByIdUseCase = module.get<UserFindByIdUseCase>(UserFindByIdUseCase)
    expect(userFindByIdUseCase).toBeDefined()

    const authMiddleware = module.get<AuthMiddleware>(AuthMiddleware)
    expect(authMiddleware).toBeDefined()
  })
})
