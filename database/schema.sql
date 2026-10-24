--EJECUTAR LA PRIMERA VEZ PARA QUE CREE LA BASE DE DATOS:
-- psql -U postgres -f database/schema.sql
CREATE DATABASE "maria-balbina-lab";

\c "maria-balbina-lab"

CREATE TABLE personas (
    pe_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pe_dni VARCHAR(20) NOT NULL UNIQUE,
    pe_nombre VARCHAR(100) NOT NULL,
    pe_fechaNac DATE NOT NULL,
    pe_telefono VARCHAR(20),
    pe_mail VARCHAR(100) NOT NULL UNIQUE,
    pe_direccion VARCHAR(200),
    pe_password VARCHAR(100) NOT NULL,
    pe_activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE clientes (
    cli_codigo INT PRIMARY KEY REFERENCES personas(pe_id) ON DELETE CASCADE
);

CREATE TABLE personal (
    pers_codigo INT PRIMARY KEY REFERENCES personas(pe_id) ON DELETE CASCADE,
    p_rol VARCHAR(50) NOT NULL
);