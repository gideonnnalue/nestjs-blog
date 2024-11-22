import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  /**
   * @constructor
   * @param authService
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    // check if user exists with same email
    // const existingUser = await this.usersRepository.findOne({
    //   where: { email: createUserDto.email },
    // });
    // Handle exception

    // Create a new user
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);

    return newUser;
  }

  /**
   * The method to get all the users from the database
   * @param {GetUsersParamDto} getUserParamDto
   * @param {number} limit - document limit
   * @param {number} page - page number
   * @returns {GetUsersParamDto} getUserParamDto
   */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    return [
      { firstName: 'John', email: 'john@gmail.com' },
      { firstName: 'Alice', email: 'alice@gmail.com' },
    ];
  }

  /**
   * Find a user by identifier
   * @param {string} id
   * @returns {User} user
   */
  public findOneById(id: string) {
    return { firstName: 'John', email: 'john@gmail.com' };
  }
}
