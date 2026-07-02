import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('clientes')
export class Client {
  @PrimaryGeneratedColumn('increment', { name: 'id_cliente' })
  id: number;

  @Column({ name: 'nome_completo', length: 200 })
  nomeCompleto: string;

  @Column({ name: 'cpf_cnpj', length: 14, unique: true })
  cpfCnpj: string;

  @Column({ name: 'tipo_cliente', length: 2 }) // 'PF' ou 'PJ'
  tipoCliente: string;

  @Column({ length: 150, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  telefone: string;

  @Column({ name: 'renda_mensal', type: 'decimal', precision: 15, scale: 2, nullable: true })
  rendaMensal: number;

  @Column({ name: 'contador_acessos', default: 0 }) // Contador exigido no MVP
  contadorAcessos: number;

  @CreateDateColumn({ name: 'data_cadastro' })
  dataCadastro: Date;

  @UpdateDateColumn({ name: 'data_atualizacao', nullable: true })
  dataAtualizacao: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true }) // Soft Delete exigido no MVP
  deletedAt: Date;
}