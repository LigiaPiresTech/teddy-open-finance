-- =============================================================================
-- TABELA: cidade
-- =============================================================================
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE cidade CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE seq_cidade'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

CREATE SEQUENCE seq_cidade START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE cidade (
    id_cidade        NUMBER(10) NOT NULL,
    nome_cidade      VARCHAR2(150) NOT NULL,
    uf               VARCHAR2(2) NOT NULL,
    codigo_ibge      VARCHAR2(10),
    pais             VARCHAR2(100) DEFAULT 'Brasil',
    data_cadastro    DATE DEFAULT SYSDATE NOT NULL,
    data_atualizacao DATE,
    usuario_cadastro VARCHAR2(50),
    CONSTRAINT pk_cidade PRIMARY KEY (id_cidade)
);

COMMENT ON TABLE cidade IS 'Tabela que armazena o cadastro de cidades/municípios.';

CREATE OR REPLACE TRIGGER trg_biu_cidade
BEFORE INSERT OR UPDATE ON cidade
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        IF :NEW.id_cidade IS NULL THEN
            SELECT seq_cidade.NEXTVAL INTO :NEW.id_cidade FROM DUAL;
        END IF;
        :NEW.data_cadastro := SYSDATE;
        :NEW.usuario_cadastro := COALESCE(SYS_CONTEXT('USERENV', 'CLIENT_IDENTIFIER'), USER);
    ELSIF UPDATING THEN
        :NEW.data_atualizacao := SYSDATE;
    END IF;
END;
/
