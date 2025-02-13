import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Company } from './company.entity'

@Injectable()
export class CompanyRepositoryImpl extends Repository<Company> {}
