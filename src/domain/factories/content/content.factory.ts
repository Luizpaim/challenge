/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs'
import * as path from 'path'
import { ContentEntity } from 'src/domain/entities'
import { TypeContentEnum } from 'src/domain'

import { BadRequestException } from '@nestjs/common'
import { ProvisionDto } from 'src/shared/dto/provision.dto'

export class ContentFactory {
  static create(content: ContentEntity): ProvisionDto {
    if (!this.contentTypeMap[content.type]) {
      throw new BadRequestException(`Unsupported content type: ${content.type}`)
    }

    return this.contentTypeMap[content.type](content)
  }

  private static calculateFileSize(url?: string): number {
    if (!url) return 0
    return fs.existsSync(url) ? fs.statSync(url).size : 0
  }

  private static generateSignedUrl({
    originalUrl,
    expirationTime,
  }: {
    originalUrl: string
    expirationTime: number
  }): string {
    if (!originalUrl || !expirationTime) return

    const expires = Math.floor(Date.now() / 1000) + expirationTime

    const signature = Math.random().toString(36).substring(7)

    return `${originalUrl}?expires=${expires}&signature=${signature}`
  }

  private static readonly contentTypeMap: Record<string, (content: ContentEntity) => ProvisionDto> =
    {
      [TypeContentEnum.TEXT]: (content) => {
        const bytes = ContentFactory.calculateFileSize(content.url)

        const url = ContentFactory.generateSignedUrl({
          originalUrl: content.url || '',
          expirationTime: 3600,
        })

        return {
          id: content.id,
          title: content.title,
          cover: content.cover,
          created_at: content.createdAt,
          description: content.description,
          total_likes: content.totalLikes,
          type: TypeContentEnum.TEXT,
          url,
          allow_download: true,
          is_embeddable: false,
          format: TypeContentEnum.TEXT,
          bytes,
          metadata: {
            author: 'Unknown',
            pages: Math.floor(bytes / 50000) || 1,
            encrypted: false,
          },
        }
      },
      [TypeContentEnum.PDF]: (content) => {
        const bytes = ContentFactory.calculateFileSize(content.url)

        const url = ContentFactory.generateSignedUrl({
          originalUrl: content.url || '',
          expirationTime: 3600,
        })

        return {
          id: content.id,
          title: content.title,
          cover: content.cover,
          created_at: content.createdAt,
          description: content.description,
          total_likes: content.totalLikes,
          type: TypeContentEnum.PDF,
          url,
          allow_download: true,
          is_embeddable: false,
          format: TypeContentEnum.PDF,
          bytes,
          metadata: {
            author: 'Unknown',
            pages: Math.floor(bytes / 50000) || 1,
            encrypted: false,
          },
        }
      },
      [TypeContentEnum.IMAGE]: (content) => {
        const bytes = ContentFactory.calculateFileSize(content.url)

        const url = ContentFactory.generateSignedUrl({
          originalUrl: content.url || '',
          expirationTime: 3600,
        })

        return {
          id: content.id,
          title: content.title,
          cover: content.cover,
          created_at: content.createdAt,
          description: content.description,
          total_likes: content.totalLikes,
          type: TypeContentEnum.IMAGE,
          url,
          allow_download: true,
          is_embeddable: true,
          format: path.extname(content.url || '').slice(1) || 'jpg',
          bytes,
          metadata: { resolution: '1920x1080', aspect_ratio: '16:9' },
        }
      },
      [TypeContentEnum.VIDEO]: (content) => {
        const bytes = ContentFactory.calculateFileSize(content.url)

        const url = ContentFactory.generateSignedUrl({
          originalUrl: content.url || '',
          expirationTime: 3600,
        })

        return {
          id: content.id,
          title: content.title,
          cover: content.cover,
          created_at: content.createdAt,
          description: content.description,
          total_likes: content.totalLikes,
          type: TypeContentEnum.VIDEO,
          url: url,
          allow_download: false,
          is_embeddable: true,
          format: path.extname(content.url || '').slice(1) || 'mp4',
          bytes,
          metadata: { duration: Math.floor(bytes / 100000) || 10, resolution: '1080p' },
        }
      },

      [TypeContentEnum.LINK]: (content) => {
        const url = ContentFactory.generateSignedUrl({
          originalUrl: content.url || '',
          expirationTime: 3600,
        })

        return {
          id: content.id,
          title: content.title,
          cover: content.cover,
          created_at: content.createdAt,
          description: content.description,
          total_likes: content.totalLikes,
          type: TypeContentEnum.LINK,
          url: url || 'http://default.com',
          allow_download: false,
          is_embeddable: true,
          format: null,
          bytes: 0,
          metadata: { trusted: content.url?.includes('https') || false },
        }
      },
    }
}
