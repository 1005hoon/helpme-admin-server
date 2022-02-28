import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { __MARKETING_DB__ } from 'src/utils/constants';
import { Corp, CorpSchema } from './corp.schema';
import { CorpsController } from './corps.controller';
import { CorpsService } from './corps.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Corp.name, schema: CorpSchema }],
      'DB_PROD',
    ),
  ],
  controllers: [CorpsController],
  providers: [CorpsService],
})
export class CorpsModule {}
