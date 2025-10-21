import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QdrantService } from './qdrant.service';
import qdrantConfig from 'src/config/qdrant.config';

@Module({
  imports: [ConfigModule.forFeature(qdrantConfig)],
  providers: [QdrantService],
  exports: [QdrantService],
})
export class QdrantModule {}
