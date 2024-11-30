import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';

@Injectable()
export class FindOneByGoogleIdProvider {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async findOneByGoogleId(googleId: string): Promise<User> {
    return await this.usersRepository.findOneBy({ googleId });
  }
}
