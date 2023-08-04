import { HttpException, Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatusService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStatusDto: CreateStatusDto) {
    try {
      return await this.prisma.status.create({ data: createStatusDto });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findAll() {
    try {
      return await this.prisma.status.findMany();
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.status.findUnique({ where: { id } });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async update(id: number, updateStatusDto: UpdateStatusDto) {
    try {
      return await this.prisma.status.update({
        where: { id },
        data: updateStatusDto,
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.status.update({
        where: { id },
        data: { orders: { set: [] }, inventories: { set: [] } },
      });
      return await this.prisma.status.delete({ where: { id } });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }
}
