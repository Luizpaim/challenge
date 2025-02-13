import * as express from 'express'
import { join } from 'path'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: ['http://localhost:4000'], // Substitua pela URL do seu frontend
    credentials: true, // Permitir envio de cookies e headers de autenticação
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
  app.use('/uploads', express.static(join(__dirname, '..', 'static')))

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
