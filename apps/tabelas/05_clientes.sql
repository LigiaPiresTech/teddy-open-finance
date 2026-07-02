-- =============================================================================
-- TABELA: clientes
-- =============================================================================
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE clientes CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE seq_clientes'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

CREATE SEQUENCE seq_clientes START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE clientes (
    id_cliente           NUMBER(10) NOT NULL,
    nome_completo        VARCHAR2(200) NOT NULL,
    cpf_cnpj             VARCHAR2(14) NOT NULL,
    tipo_cliente         VARCHAR2(2) NOT NULL,
    data_nascimento      DATE,
    email                VARCHAR2(150),
    telefone             VARCHAR2(20),
    celular              VARCHAR2(20),
    estado_civil         VARCHAR2(30),
    profissao            VARCHAR2(100),
    empresa_trabalho     VARCHAR2(150),
    tempo_emprego_meses  NUMBER(4),
    renda_mensal         NUMBER(15,2),
    rua                  VARCHAR2(200),
    numero               VARCHAR2(20),
    complemento          VARCHAR2(150),
    id_bairro            NUMBER(10),
    id_cidade            NUMBER(10),
    id_cep               NUMBER(10),
    status_cliente       VARCHAR2(20) DEFAULT 'ATIVO' NOT NULL,
    data_cadastro        DATE DEFAULT SYSDATE NOT NULL,
    data_atualizacao     DATE,
    usuario_cadastro     VARCHAR2(50),
    CONSTRAINT pk_clientes PRIMARY KEY (id_cliente),
    CONSTRAINT fk_clientes_bairro FOREIGN KEY (id_bairro) REFERENCES bairro(id_bairro),
    CONSTRAINT fk_clientes_cidade FOREIGN KEY (id_cidade) REFERENCES cidade(id_cidade),
    CONSTRAINT fk_clientes_cep FOREIGN KEY (id_cep) REFERENCES cep(id_cep),
    CONSTRAINT chk_tipo_cliente CHECK (tipo_cliente IN ('PF', 'PJ'))
);

CREATE UNIQUE INDEX idx_clientes_doc ON clientes(cpf_cnpj);
COMMENT ON TABLE clientes IS 'Tabela principal de cadastro de clientes.';

CREATE OR REPLACE TRIGGER trg_biu_clientes
BEFORE INSERT OR UPDATE ON clientes
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        IF :NEW.id_cliente IS NULL THEN
            SELECT seq_clientes.NEXTVAL INTO :NEW.id_cliente FROM DUAL;
        END IF;
        :NEW.data_cadastro := SYSDATE;
        :NEW.usuario_cadastro := COALESCE(SYS_CONTEXT('USERENV', 'CLIENT_IDENTIFIER'), USER);
    ELSIF UPDATING THEN
        :NEW.data_atualizacao := SYSDATE;
    END IF;
END;
/
