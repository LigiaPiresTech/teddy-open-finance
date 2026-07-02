import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo cliente' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os clientes ativos' })
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca detalhes de um cliente e incrementa o contador' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um cliente' })
  update(@Param('id') id: string, @Body() updateClientDto: any) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um cliente utilizando Soft Delete' })
  remove(@Param('id') id: string) {
    return this.clientsService.softDelete(+id);
  }
}