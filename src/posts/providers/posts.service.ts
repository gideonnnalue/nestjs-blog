import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    return [
      { user, title: 'Test Tile', content: 'Test content' },
      { user, title: 'Test tile 2', content: 'Test content' },
    ];
  }
}
