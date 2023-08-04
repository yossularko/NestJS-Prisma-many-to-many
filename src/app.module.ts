import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TagsModule } from './tags/tags.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PrismaModule, TagsModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
