-- =============================================================================
-- TABELA: bairro
-- =============================================================================
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE bairro CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE seq_bairro'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

CREATE SEQUENCE seq_bairro START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE bairro (
    id_bairro        NUMBER(10) NOT NULL,
    nome_bairro      VARCHAR2(150) NOT NULL,
    id_cidade        NUMBER(10) NOT NULL,
    data_cadastro    DATE DEFAULT SYSDATE NOT NULL,
    data_atualizacao DATE,
    usuario_cadastro VARCHAR2(50),
    CONSTRAINT pk_bairro PRIMARY KEY (id_bairro),
    CONSTRAINT fk_bairro_cidade FOREIGN KEY (id_cidade) REFERENCES cidade(id_cidade)
);

COMMENT ON TABLE bairro IS 'Tabela que armazena os bairros vinculados às cidades.';

CREATE OR REPLACE TRIGGER trg_biu_bairro
BEFORE INSERT OR UPDATE ON bairro
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        IF :NEW.id_bairro IS NULL THEN
            SELECT seq_bairro.NEXTVAL INTO :NEW.id_bairro FROM DUAL;
        END IF;
        :NEW.data_cadastro := SYSDATE;
        :NEW.usuario_cadastro := COALESCE(SYS_CONTEXT('USERENV', 'CLIENT_IDENTIFIER'), USER);
    ELSIF UPDATING THEN
        :NEW.data_atualizacao := SYSDATE;
    END IF;
END;
/
