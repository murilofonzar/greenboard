import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  ParseUUIDPipe,
  Req,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDTO, UpdateActivityDTO } from './dto/create-activity.dto';
import { SubmitActivityDTO, CorrectSubmissionDTO } from './dto/submit-activity.dto';
import { PaginationQueryDTO } from '../common/dto/pagination-query.dto';
import { Roles } from '../auth/roles.decorator';
import { ActivityOwnerGuard } from '../auth/guards/activity-owner.guard';

@ApiTags('Activities')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Post()
  @Roles('PROFESSOR')
  @ApiOperation({
    summary: 'Criar nova atividade (professor)',
    description:
      'Para anexar imagens/áudios, envie os arquivos antes em POST /media/upload e use as URLs retornadas em `media[]` (nível da atividade) ou em `questions[].imageUrl` / `questions[].audioUrl`.',
  })
  @ApiResponse({ status: 201, description: 'Atividade criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Apenas professores' })
  create(@Body() dto: CreateActivityDTO, @Req() req: any) {
    return this.service.create(dto, req.user.sub);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar atividades',
    description:
      'Professor: suas atividades. Aluno: atividades publicadas do seu nível ainda não respondidas (sem gabarito).',
  })
  @ApiResponse({ status: 200, description: 'Lista de atividades' })
  findAll(@Req() req: any, @Query() query: PaginationQueryDTO) {
    return this.service.findAll(req.user.sub, req.user.role, query.skip, query.take);
  }

  @Get('results/student')
  @Roles('ALUNO')
  @ApiOperation({ summary: 'Obter resultados do aluno' })
  @ApiResponse({ status: 200, description: 'Resultados do aluno' })
  studentResults(@Req() req: any, @Query() query: PaginationQueryDTO) {
    return this.service.getStudentResults(req.user.sub, query.skip, query.take);
  }

  @Get('results/professor')
  @Roles('PROFESSOR')
  @ApiOperation({ summary: 'Obter resultados das atividades do professor' })
  @ApiResponse({ status: 200, description: 'Resultados dos alunos' })
  professorResults(@Req() req: any, @Query() query: PaginationQueryDTO) {
    return this.service.getProfessorResults(req.user.sub, query.skip, query.take);
  }

  @Get(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOperation({ summary: 'Obter atividade específica' })
  @ApiResponse({ status: 200, description: 'Atividade encontrada' })
  @ApiResponse({ status: 404, description: 'Atividade não encontrada' })
  getOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.service.findOneForUser(id, req.user.sub, req.user.role);
  }

  @Put(':id')
  @Roles('PROFESSOR')
  @UseGuards(ActivityOwnerGuard)
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOperation({ summary: 'Atualizar atividade (inclui mídias e questões)' })
  @ApiResponse({ status: 200, description: 'Atividade atualizada' })
  @ApiResponse({ status: 403, description: 'Não autorizado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateActivityDTO,
    @Req() req: any,
  ) {
    return this.service.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  @Roles('PROFESSOR')
  @UseGuards(ActivityOwnerGuard)
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOperation({ summary: 'Deletar atividade' })
  @ApiResponse({ status: 200, description: 'Atividade deletada' })
  @ApiResponse({ status: 403, description: 'Não autorizado' })
  delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.service.delete(id, req.user.sub);
  }

  @Post(':id/publish')
  @Roles('PROFESSOR')
  @UseGuards(ActivityOwnerGuard)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOperation({ summary: 'Publicar atividade' })
  @ApiResponse({ status: 200, description: 'Atividade publicada' })
  publish(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.service.publishActivity(id, req.user.sub);
  }

  @Post(':id/submit')
  @Roles('ALUNO')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOperation({ summary: 'Submeter respostas para atividade (aluno)' })
  @ApiResponse({ status: 201, description: 'Respostas submetidas' })
  @ApiResponse({ status: 400, description: 'Atividade já respondida' })
  submit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SubmitActivityDTO,
    @Req() req: any,
  ) {
    return this.service.submit(id, req.user.sub, dto);
  }

  @Post('submission/:id/correct')
  @Roles('PROFESSOR')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', format: 'uuid', description: 'ID da submissão' })
  @ApiOperation({ summary: 'Corrigir submissão' })
  @ApiResponse({ status: 200, description: 'Submissão corrigida' })
  @ApiResponse({ status: 403, description: 'Não autorizado' })
  correct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CorrectSubmissionDTO,
    @Req() req: any,
  ) {
    return this.service.correctSubmission(id, req.user.sub, body);
  }
}
