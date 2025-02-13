import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateContentsTable1738181025397 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE contents (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        description VARCHAR(500),
        url VARCHAR(255) NOT NULL,
        total_likes INTEGER NOT NULL DEFAULT 0,
        type VARCHAR(255) NOT NULL,
        cover VARCHAR(255),
        company_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP DEFAULT NULL,
        CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE contents')
  }
}
