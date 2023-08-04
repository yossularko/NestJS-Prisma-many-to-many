import { HttpException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    try {
      return await this.prisma.tag.create({ data: createTagDto });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findAll() {
    try {
      return await this.prisma.tag.findMany();
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.tag.findUnique({ where: { id } });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    try {
      return await this.prisma.tag.update({
        where: { id },
        data: updateTagDto,
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.tag.update({
        where: { id },
        data: { posts: { set: [] } },
      });
      return await this.prisma.tag.delete({ where: { id } });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }
}
