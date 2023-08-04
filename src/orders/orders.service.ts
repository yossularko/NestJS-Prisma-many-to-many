import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { statusId, ...rest } = createOrderDto;
    try {
      return await this.prisma.order.create({
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
      const response = await this.prisma.order.findMany({
        include: { Status: true },
      });

      const newVal = response.map((item) => {
        const order = { ...item, status: item.Status.name };

        delete order.Status;
        return order;
      });

      return newVal;
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findOne(id: number) {
    try {
      const response = await this.prisma.order.findUnique({
        where: { id },
        include: { Status: true, log: { include: { Status: true } } },
      });

      if (!response) {
        throw new NotFoundException('Cannot find order!');
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

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const { statusId, ...rest } = updateOrderDto;
    const founded = await this.findOne(id);

    if (!founded) {
      throw new NotFoundException('Order not found!');
    }

    const logs = founded.log.map((item) => item.id);

    try {
      return await this.prisma.order.update({
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
      await this.prisma.order.update({
        where: { id },
        data: { log: { set: [] } },
      });
      return await this.prisma.order.delete({ where: { id } });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }
}
