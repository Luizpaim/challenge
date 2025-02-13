import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Content } from '../content/content.entity'
import { User } from '../user'

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @OneToMany(() => User, (user) => user.company)
  users: User[]

  @OneToMany(() => Content, (content) => content.company)
  contents: Content[]
}
