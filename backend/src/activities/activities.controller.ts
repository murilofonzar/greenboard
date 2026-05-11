import {
  Controller,
  Post,
  Get,
  Body,
  Request,
} from '@nestjs/common';

import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Post()
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.service.findAll(req.user);
  }
}