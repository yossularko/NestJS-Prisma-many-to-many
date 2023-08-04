import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TagsModule } from './tags/tags.module';
import { PostsModule } from './posts/posts.module';
import { StatusModule } from './status/status.module';
import { OrdersModule } from './orders/orders.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [PrismaModule, TagsModule, PostsModule, StatusModule, OrdersModule, InventoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
