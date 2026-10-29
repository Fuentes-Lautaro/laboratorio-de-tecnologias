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
    pe_rol VARCHAR(50) NOT NULL,
    pe_activo BOOLEAN NOT NULL DEFAULT TRUE
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
    p_stock INT NOT NULL DEFAULT 0 CHECK (p_stock >= 0),
    p_activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE planes (
    ps_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ps_nombre VARCHAR(100) NOT NULL,
    ps_descripcion TEXT,
    ps_cantidad_vinos INT NOT NULL CHECK (ps_cantidad_vinos > 0),
    ps_valor NUMERIC(10, 2) NOT NULL CHECK (ps_valor >= 0),
    ps_activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE eventos (
    e_id SERIAL PRIMARY KEY,
    e_nombre VARCHAR(100) NOT NULL,
    e_fecha DATE NOT NULL,
    e_descripcion TEXT,
    e_cant_asist INT,
    e_url_imagen VARCHAR(255)
);

CREATE TABLE ventas (
    v_codigo VARCHAR(50) PRIMARY KEY, 
    v_fecha TIMESTAMP NOT NULL,
    cliente_id INT REFERENCES personas(pe_id) ON DELETE SET NULL, 
    personal_id INT REFERENCES personas(pe_id) ON DELETE SET NULL, 
    evento_id INT REFERENCES eventos(e_id) ON DELETE SET NULL, 
    v_total NUMERIC(10, 2) NOT NULL,
    v_metodo_pago VARCHAR(50) NOT NULL
);

CREATE TABLE reglones_venta (
    iv_id SERIAL PRIMARY KEY,
    venta_codigo VARCHAR(50) NOT NULL REFERENCES ventas(v_codigo) ON DELETE CASCADE,
    producto_codigo INT NOT NULL REFERENCES productos(p_id),
    iv_cantidad INT NOT NULL,
    iv_precio_unidad NUMERIC(10, 2) NOT NULL
);

CREATE TABLE suscripcion (
    s_id SERIAL PRIMARY KEY,
    s_fecha_pago DATE NOT NULL,
    s_monto_pago NUMERIC(10, 2) NOT NULL,
    cliente_id INT NOT NULL,
    ps_id INT NOT NULL,
    CONSTRAINT fk_cliente FOREIGN KEY (cliente_id) REFERENCES personas(pe_id),
    CONSTRAINT fk_plan_suscripcion FOREIGN KEY (ps_id) REFERENCES planes(ps_id)
);

