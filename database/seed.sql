--EJECUTAR PARA CARGAR ESTOS VALORES:
-- psql -U postgres -d maria-balbina-lab -f database/seed.sql

INSERT INTO personas (pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_password, pe_activo)
VALUES ('28123456', 'Roberto Fernández', '1982-04-12', '2664112233', 'admin@mariabalbina.com', 'Av. Illia 450, San Luis', '$2b$10$04hTBqwI7SxBizwSm0cgkOSDWbgONu6S0AH75/O7JCQDCfHu0dHWm', true);

INSERT INTO personal (pers_codigo, p_rol)
VALUES (LASTVAL(), 'vendedor');

INSERT INTO personas (pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_password, pe_activo)
VALUES ('31987654', 'Sofia Martínez', '1988-09-25', '2664998877', 'gestor@mariabalbina.com', 'Pedernera 1230, San Luis', '$2b$10$0FGrkEfTeZluMinZ1nMdCuGrX5VCxaFFMp/8aeDk/XVIoCjQtD5aC', true);

INSERT INTO personal (pers_codigo, p_rol)
VALUES (LASTVAL(), 'gerente');

INSERT INTO personas (pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_password, pe_activo)
VALUES ('35456789', 'Camila Torres', '1994-01-18', '2664556677', 'cm@mariabalbina.com', 'Junín 850, San Luis', '$2b$10$QemykBh3qpFNqqRivissB.4BkQChG4RMIzY0CZGNCI7F3v.ejF43.', true);

INSERT INTO personal (pers_codigo, p_rol)
VALUES (LASTVAL(), 'CM');