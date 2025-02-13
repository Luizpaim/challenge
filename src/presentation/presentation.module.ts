import { HttpStatus, Module } from '@nestjs/common'
import { ApolloDriver } from '@nestjs/apollo'
import { GraphQLError } from 'graphql'
import { GraphQLModule } from '@nestjs/graphql'
import { ConfigModule } from '@nestjs/config'

import { ProvisionUseCase, UserFindByIdUseCase } from 'src/application/use-cases'
import { ContentResolver } from './resolvers'
import { AuthMiddleware } from './middlewares'
import { DatabaseModule } from 'src/infrastructure/database/database.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      driver: ApolloDriver,
      introspection: true,
      playground: true,
      formatError: (error: GraphQLError) => {
        return {
          message: error.extensions?.originalError?.['message'],
          status_code:
            Number(error.extensions?.originalError?.['statusCode']) ||
            Number(error?.extensions?.code) ||
            HttpStatus.BAD_REQUEST,
          details: error?.extensions?.exception?.['details'] || error.extensions?.details,
        }
      },
    }),
  ],
  providers: [ContentResolver, ProvisionUseCase, UserFindByIdUseCase, AuthMiddleware],
  exports: [ContentResolver, ProvisionUseCase, UserFindByIdUseCase, AuthMiddleware],
})
export class ResolverModule {}
