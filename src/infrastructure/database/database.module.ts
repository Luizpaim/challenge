import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Company } from './typeORM/entities/company/company.entity'
import { CompanyRepositoryImpl } from './typeORM/entities/company/company.repository'
import { Content } from './typeORM/entities/content/content.entity'
import { ContentRepositoryImpl } from './typeORM/entities/content/content.repository'
import { User, UserRepositoryImpl } from './typeORM/entities/user'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Company, User, Content]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATA_SOURCE_HOST || 'localhost',
      port: parseInt(process.env.DATA_SOURCE_PORT) || 5432,
      username: process.env.DATA_SOURCE_USERNAME || 'postgres',
      password: process.env.DATA_SOURCE_PASSWORD || 'root',
      database: process.env.DATA_SOURCE_DATABASE || 'challenge',
      autoLoadEntities: true,
      synchronize: false,
    }),
  ],
  providers: [
    {
      provide: 'CompanyRepository',
      useClass: CompanyRepositoryImpl,
    },
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: 'ContentRepository',
      useClass: ContentRepositoryImpl,
    },
  ],
  exports: ['UserRepository', 'ContentRepository', 'CompanyRepository'],
})
export class DatabaseModule {}
