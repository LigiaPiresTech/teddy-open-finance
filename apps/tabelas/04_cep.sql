-- =============================================================================
-- TABELA: cep
-- =============================================================================
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE cep CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE seq_cep'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

CREATE SEQUENCE seq_cep START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE cep (
    id_cep           NUMBER(10) NOT NULL,
    cep              VARCHAR2(8) NOT NULL,
    logradouro       VARCHAR2(200) NOT NULL,
    complemento      VARCHAR2(150),
    id_bairro        NUMBER(10) NOT NULL,
    id_cidade        NUMBER(10) NOT NULL,
    uf               VARCHAR2(2) NOT NULL,
    tipo_logradouro  VARCHAR2(30),
    data_cadastro    DATE DEFAULT SYSDATE NOT NULL,
    data_atualizacao DATE,
    usuario_cadastro VARCHAR2(50),
    CONSTRAINT pk_cep PRIMARY KEY (id_cep),
    CONSTRAINT fk_cep_bairro FOREIGN KEY (id_bairro) REFERENCES bairro(id_bairro),
    CONSTRAINT fk_cep_cidade FOREIGN KEY (id_cidade) REFERENCES cidade(id_cidade)
);

CREATE INDEX idx_cep_numero ON cep(cep);
COMMENT ON TABLE cep IS 'Tabela que armazena o cadastro de CEPs e logradouros.';

CREATE OR REPLACE TRIGGER trg_biu_cep
BEFORE INSERT OR UPDATE ON cep
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        IF :NEW.id_cep IS NULL THEN
            SELECT seq_cep.NEXTVAL INTO :NEW.id_cep FROM DUAL;
        END IF;
        :NEW.data_cadastro := SYSDATE;
        :NEW.usuario_cadastro := COALESCE(SYS_CONTEXT('USERENV', 'CLIENT_IDENTIFIER'), USER);
    ELSIF UPDATING THEN
        :NEW.data_atualizacao := SYSDATE;
    END IF;
END;
/
