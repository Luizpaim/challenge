import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATA_SOURCE_HOST || 'localhost',
  port: parseInt(process.env.DATA_SOURCE_PORT) || 5432,
  username: process.env.DATA_SOURCE_USERNAME || 'postgres',
  password: process.env.DATA_SOURCE_PASSWORD || 'root',
  database: process.env.DATA_SOURCE_DATABASE || 'challenge',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migration/*{.ts,.js}'],
})
