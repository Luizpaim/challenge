import { Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'

import { ResolverModule } from './presentation/presentation.module'
import { DatabaseModule } from './infrastructure/database/database.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, ResolverModule],
})
export class AppModule {}
