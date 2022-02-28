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
import { CreateMemoDto } from './dto/create-memo.dto';
import { QuotationAdditionalService } from './quotation-additionals.service';
import { QuotationMemosService } from './quotation-memos.service';

@Controller('quotations')
export class QuotationsController {
  constructor(
    private readonly additionalsService: QuotationAdditionalService,
    private readonly memosService: QuotationMemosService,
  ) {}

  @Get('/memos')
  getMemos() {
    return this.memosService.getAllMemos();
  }

  @Get('/memos/:id')
  getMemoById(@Param('id') id: string) {
    return this.memosService.getMemoById(id);
  }

  @Post('/memos')
  createMemo(@Body() memoDto: CreateMemoDto) {
    return this.memosService.createNewMemo(memoDto);
  }

  @Put('/memos/:id')
  updateMemo(@Param('id') id: string, @Body() memoDto: Partial<CreateMemoDto>) {
    return this.memosService.updateMemoById(id, memoDto);
  }

  @Delete('/memos/:id')
  deleteMemo(@Param('id') id: string) {
    return this.memosService.removeMemoById(id);
  }

  @Get('/additionals')
  getAdditionals() {
    return this.additionalsService.getAllAdditionals();
  }

  @Get('/additionals/:id')
  getAdditional(@Param('id') id: string) {
    return this.additionalsService.getAdditionalById(id);
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
