--EJECUTAR LA PRIMERA VEZ PARA QUE CREE LA BASE DE DATOS:
-- psql -U postgres -f database/schema.sql
DROP DATABASE "maria-balbina-lab";

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
    cli_id INT PRIMARY KEY REFERENCES personas(pe_id) ON DELETE CASCADE
);

CREATE TABLE personal (
    pers_id INT PRIMARY KEY REFERENCES personas(pe_id) ON DELETE CASCADE,
    p_rol VARCHAR(50) NOT NULL
);

CREATE TABLE productos (
    p_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    p_marca VARCHAR(50) NOT NULL,
    p_tipo VARCHAR(50) NOT NULL,
    p_precio NUMERIC(10, 2) NOT NULL CHECK (p_precio >= 0),
    p_costo NUMERIC(10, 2) NOT NULL CHECK (p_costo >= 0),
    p_anio INT CHECK (p_anio BETWEEN 1800 AND EXTRACT(YEAR FROM CURRENT_DATE)),
    p_medida VARCHAR(20),
    p_varietal VARCHAR(50),
    p_bodega VARCHAR(50),
    p_descripcion VARCHAR(500),
    p_imagen_url VARCHAR(200),
    p_stock INT NOT NULL DEFAULT 0 CHECK (p_stock >= 0)
);

CREATE TABLE planes (
    ps_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ps_nombre VARCHAR(100) NOT NULL,
    ps_descripcion TEXT,
    ps_cantidad_vinos INT NOT NULL CHECK (ps_cantidad_vinos > 0),
    ps_valor NUMERIC(10, 2) NOT NULL CHECK (ps_valor >= 0),
    ps_activo BOOLEAN NOT NULL DEFAULT TRUE
);