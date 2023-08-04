import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const { tagIds, ...rest } = createPostDto;
    try {
      return await this.prisma.post.create({
        data: {
          ...rest,
          tags: { connect: tagIds.map((val) => ({ id: val })) },
        },
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findAll() {
    try {
      return await this.prisma.post.findMany({ include: { tags: true } });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.post.findUnique({
        where: { id },
        include: { tags: true },
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const { tagIds, ...rest } = updatePostDto;
    try {
      return await this.prisma.post.update({
        where: { id },
        data: {
          ...rest,
          tags: tagIds
            ? { set: tagIds.map((val) => ({ id: val })) }
            : undefined,
        },
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.post.update({
        where: { id },
        data: { tags: { set: [] } },
      });
      return await this.prisma.post.delete({ where: { id } });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }
}
