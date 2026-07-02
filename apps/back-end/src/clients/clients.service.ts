import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientRepository.create(createClientDto);
    return await this.clientRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find(); // O TypeORM ignora os registros com 'deleted_at' automaticamente
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado.`);
    }

    // Incrementa o contador de acessos pedido no desafio
    client.contadorAcessos += 1;
    await this.clientRepository.save(client);

    return client;
  }

  async update(id: number, updateClientDto: any): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado.`);
    }
    Object.assign(client, updateClientDto);
    return await this.clientRepository.save(client);
  }

  async softDelete(id: number): Promise<void> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado.`);
    }
    await this.clientRepository.softRemove(client); // Executa o Soft Delete preenchendo a data de exclusão
  }
}