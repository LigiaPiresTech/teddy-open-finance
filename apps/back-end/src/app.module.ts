import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config'; // Importa a config que criamos acima
import { ClientsModule } from './clients/clients.module';   // O módulo do CRUD de clientes
import { AuthModule } from './auth/auth.module';           // O módulo de autenticação

@Module({
  imports: [
    // Inicializa a conexão com o banco de dados PostgreSQL
    TypeOrmModule.forRoot(databaseConfig),
    
    // Importa os submódulos da regra de negócio
    ClientsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}