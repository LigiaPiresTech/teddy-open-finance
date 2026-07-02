import { IsNotEmpty, IsString, IsEmail, IsOptional, IsEnum, Length } from 'class-validator';

export enum TipoCliente {
  PF = 'PF',
  PJ = 'PJ'
}

export class CreateClientDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome completo é obrigatório.' })
  nomeCompleto: string;

  @IsString()
  @Length(11, 14, { message: 'O CPF ou CNPJ deve ter entre 11 e 14 caracteres.' })
  cpfCnpj: string;

  @IsEnum(TipoCliente, { message: 'O tipo de cliente deve ser PF ou PJ.' })
  tipoCliente: TipoCliente;

  @IsEmail({}, { message: 'E-mail em formato inválido.' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefone?: string;
}