-- =============================================================================
-- TABELA: usuarios
-- =============================================================================
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE usuarios CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE seq_usuarios'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

CREATE SEQUENCE seq_usuarios START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE TABLE usuarios (
    id_usuario          NUMBER(10) NOT NULL,
    nome_usuario        VARCHAR2(150) NOT NULL,
    login               VARCHAR2(50) NOT NULL,
    senha_hash          VARCHAR2(255) NOT NULL,
    email               VARCHAR2(150),
    telefone            VARCHAR2(20),
    perfil_acesso       VARCHAR2(50),
    status_usuario      VARCHAR2(20) DEFAULT 'ATIVO' NOT NULL,
    data_ultimo_acesso  DATE,
    data_cadastro       DATE DEFAULT SYSDATE NOT NULL,
    data_atualizacao    DATE,
    usuario_cadastro    VARCHAR2(50),
    CONSTRAINT pk_usuarios PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuarios_login UNIQUE (login)
);

COMMENT ON TABLE usuarios IS 'Tabela que armazena os usuários credenciados no sistema.';

CREATE OR REPLACE TRIGGER trg_biu_usuarios
BEFORE INSERT OR UPDATE ON usuarios
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        IF :NEW.id_usuario IS NULL THEN
            SELECT seq_usuarios.NEXTVAL INTO :NEW.id_usuario FROM DUAL;
        END IF;
        :NEW.data_cadastro := SYSDATE;
        :NEW.usuario_cadastro := COALESCE(SYS_CONTEXT('USERENV', 'CLIENT_IDENTIFIER'), USER);
    ELSIF UPDATING THEN
        :NEW.data_atualizacao := SYSDATE;
    END IF;
END;
/
