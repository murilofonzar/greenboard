/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';

import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Post()
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.service.submit(id, req.user.id, body.answers);
  }

  @Get('results/student')
  studentResults(@Req() req: any) {
    return this.service.getStudentResults(req.user.id);
  }

  @Get('results/professor')
  professorResults(@Req() req: any) {
    return this.service.getProfessorResults(req.user.id);
  }

  @Post('submission/:id/correct')
  correct(@Param('id') id: string, @Body() body: any) {
    return this.service.correctSubmission(id, body.score, body.feedback);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.service.publishActivity(id);
  }

  @Post(':id/update')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.updateActivity(id, dto);
  }
}
