import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInventoryDto: CreateInventoryDto) {
    const { statusId, ...rest } = createInventoryDto;
    try {
      return await this.prisma.inventory.create({
        data: {
          ...rest,
          Status: { connect: { id: statusId ? statusId : 1 } },
          log: {
            create: { Status: { connect: { id: statusId ? statusId : 1 } } },
          },
        },
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findAll() {
    try {
      const response = await this.prisma.inventory.findMany({
        include: { Status: true },
      });

      const newVal = response.map((item) => {
        const inventory = { ...item, status: item.Status.name };

        delete inventory.Status;
        return inventory;
      });

      return newVal;
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findOne(id: number) {
    try {
      const response = await this.prisma.inventory.findUnique({
        where: { id },
        include: { Status: true, log: { include: { Status: true } } },
      });

      if (!response) {
        throw new NotFoundException('Cannot find inventory!');
      }

      const newVal = {
        ...response,
        status: response.Status.name,
        log: response.log.map((item) => ({
          id: item.id,
          statusId: item.statusId,
          status: item.Status.name,
          createdAt: item.createdAt,
        })),
      };

      delete newVal.Status;

      return newVal;
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const { statusId, ...rest } = updateInventoryDto;
    const founded = await this.findOne(id);

    if (!founded) {
      throw new NotFoundException('Inventory not found!');
    }

    const logs = founded.log.map((item) => item.id);

    try {
      return await this.prisma.inventory.update({
        where: { id },
        data: {
          ...rest,
          Status: statusId ? { connect: { id: statusId } } : undefined,
          log: statusId
            ? {
                set: logs.map((val) => ({ id: val })),
                create: { Status: { connect: { id: statusId } } },
              }
            : undefined,
        },
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.inventory.update({
        where: { id },
        data: { log: { set: [] } },
      });
      return await this.prisma.inventory.delete({ where: { id } });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }
}
