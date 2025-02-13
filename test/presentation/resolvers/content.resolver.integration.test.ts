import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import * as request from 'supertest'
import { ContentResolver } from 'src/presentation/resolvers/content.resolver'
import { ProvisionUseCase } from 'src/application/use-cases'
import { ProvisionDto } from 'src/shared/dto/provision.dto'
import { AuthMiddleware } from 'src/presentation/middlewares'

describe('Integration ContentResolver', () => {
  let app: INestApplication
  let provisionUseCase: ProvisionUseCase

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
        }),
      ],
      providers: [
        ContentResolver,
        {
          provide: ProvisionUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthMiddleware)
      .useValue({
        canActivate: (context: any) => {
          const gqlContext = context.getArgByIndex ? context.getArgByIndex(2) : context

          if (gqlContext && gqlContext.req && gqlContext.req.headers.authorization) {
            gqlContext.req.user = { id: 'user-id' }
            return true
          }
          return false
        },
      })
      .compile()

    app = moduleFixture.createNestApplication()
    provisionUseCase = moduleFixture.get<ProvisionUseCase>(ProvisionUseCase)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  const sendGraphQLRequest = (query: string, token: string = '') =>
    request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', token ? `Bearer ${token}` : '')
      .send({ query })

  it('should return a ProvisionDto when successful', async () => {
    const mockProvisionDto: ProvisionDto = {
      id: '1',
      title: 'Test Content',
      cover: 'https://example.com/cover.jpg',
      created_at: new Date(),
      description: 'Test Description',
      total_likes: 100,
      type: 'pdf',
      url: 'https://example.com/file.pdf',
      allow_download: true,
      is_embeddable: false,
      format: 'pdf',
      bytes: 1234,
      metadata: {},
    }

    ;(provisionUseCase.execute as jest.Mock).mockResolvedValue(mockProvisionDto)

    const query = `
      query {
        provision(content_id: "1") {
          id
          title
          type
          url
        }
      }
    `

    const response = await sendGraphQLRequest(query, 'valid_token')

    expect(response.status).toBe(200)
    expect(response.body.data.provision).toEqual({
      id: '1',
      title: 'Test Content',
      type: 'pdf',
      url: 'https://example.com/file.pdf',
    })
  })

  it('should return 400 if ProvisionUseCase.execute throws UnprocessableEntityException', async () => {
    const errorMessage = 'Expected value of type \"String!\", found null.'
    ;(provisionUseCase.execute as jest.Mock).mockRejectedValue(new Error(errorMessage))

    const query = `
      query {
        provision(content_id: ${null}) {
          id
          title
        }
      }
    `

    const response = await sendGraphQLRequest(query, 'valid_token')
    expect(response.status).toBe(400)
    expect(response.body.errors).toBeDefined()
    expect(response.body.errors[0].message).toContain(errorMessage)
  })

  it('should return Unauthorized error if token is missing', async () => {
    const query = `
      query {
        provision(content_id: "1") {
          id
          title
        }
      }
    `

    const response = await sendGraphQLRequest(query)

    expect(response.status).toBe(200)
    expect(response.body.errors).toBeDefined()
    expect(response.body.errors[0].message).toContain('Forbidden resource')
  })
})
