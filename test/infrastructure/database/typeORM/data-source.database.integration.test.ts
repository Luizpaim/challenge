import { AppDataSource } from 'src/infrastructure/database/typeORM/data-source.database'

describe('AppDataSource (Integração)', () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }
  })

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  })

  it('should connect to the database', async () => {
    expect(AppDataSource.isInitialized).toBe(true)
  })

  it('should execute a basic query', async () => {
    const result = await AppDataSource.query('SELECT 1 + 1 AS sum')
    expect(result[0].sum).toBe(2)
  })
})
