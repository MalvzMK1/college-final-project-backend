import { Module } from '@nestjs/common';
import { DatabaseModule, RedisModule } from './shared'

@Module({
  imports: [DatabaseModule, RedisModule],
})
export class AppModule {}
