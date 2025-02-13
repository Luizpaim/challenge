export enum TypeContentEnum {
  PDF = 'pdf',
  IMAGE = 'image',
  VIDEO = 'video',
  LINK = 'link',
  TEXT = 'txt',
}

export class ContentEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly title: string,
    public readonly type: TypeContentEnum,
    public readonly url: string,
    public readonly totalLikes: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
    public readonly cover?: string,
    public readonly description?: string,
  ) {}
}
