import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { TagsService } from '../../tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { Paginated } from '../../common/pagination/interfaces/paginated.interface';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from '../../auth/interfaces/active-user.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    private readonly tagsService: TagsService,
    private readonly paginationProvider: PaginationProvider,
    private readonly createPostProvider: CreatePostProvider,
  ) {}

  /**
   * Creating new post
   * @param createPostDto
   */
  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    // return the post
    return await this.createPostProvider.create(createPostDto, user);
  }

  public async findAll(
    postQuery: GetPostsDto,
    userId: number,
  ): Promise<Paginated<Post>> {
    const posts = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postRepository,
    );

    return posts;
  }

  public async update(patchPostDto: PatchPostDto) {
    // Find Tags
    const tags = await this.tagsService.findMultipleTags(patchPostDto.tags);

    // Find the Post
    const post = await this.postRepository.findOneBy({ id: patchPostDto.id });

    // Update the properties
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl = patchPostDto.featuredImageUrl ?? '';
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    // Assign the new tags
    post.tags = tags;

    return await this.postRepository.save(post);
  }

  public async delete(id: number) {
    await this.postRepository.delete(id);

    return { deleted: true, id };
  }
}
