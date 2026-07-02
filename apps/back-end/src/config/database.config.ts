import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

// Carrega as variáveis salvas no seu arquivo .env
dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  
  // Aponta para onde estão as entidades do TypeORM no seu projeto
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  
  // Sincroniza as tabelas automaticamente no banco (ótimo para desenvolvimento)
  synchronize: true, 
  logging: true,
};