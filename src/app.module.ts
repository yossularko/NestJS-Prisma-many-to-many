import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TagsModule } from './tags/tags.module';
import { PostsModule } from './posts/posts.module';
import { StatusModule } from './status/status.module';

@Module({
  imports: [PrismaModule, TagsModule, PostsModule, StatusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
