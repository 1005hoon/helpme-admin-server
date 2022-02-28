import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateAdditionalDto } from './dto/create-additional.dto';
import { QuotationAdditionalService } from './quotation-additionals.service';

@Controller('quotations')
export class QuotationsController {
  constructor(
    private readonly additionalsService: QuotationAdditionalService,
  ) {}

  @Get('/additionals')
  getAdditionals() {
    return this.additionalsService.getAllAdditionals();
  }

  @Post('/additionals')
  createAdditional(@Body() additionalDto: CreateAdditionalDto) {
    return this.additionalsService.createAdditional(additionalDto);
  }

  @Put('/additionals/:id')
  updateAdditional(
    @Param('id') id: string,
    @Body() additionalDto: Partial<CreateAdditionalDto>,
  ) {
    return this.additionalsService.updateAdditionalById(id, additionalDto);
  }

  @Delete('/additionals/:id')
  deleteAdditional(@Param('id') id: string) {
    return this.additionalsService.removeAdditionalById(id);
  }
}
