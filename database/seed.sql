-- EJECUTAR PARA CARGAR ESTOS VALORES:
-- psql -U postgres -d maria-balbina-lab -f database/seed.sql

-- INSERCION DE EMPLEADOS
INSERT INTO personas (pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_password, pe_rol, pe_activo)
VALUES 
('28123456', 'Roberto Fernández', '1982-04-12', '2664112233', 'admin@mariabalbina.com', 'Av. Illia 450, San Luis', '$2b$10$04hTBqwI7SxBizwSm0cgkOSDWbgONu6S0AH75/O7JCQDCfHu0dHWm', 'vendedor', true),
('31987654', 'Sofia Martínez', '1988-09-25', '2664998877', 'gestor@mariabalbina.com', 'Pedernera 1230, San Luis', '$2b$10$0FGrkEfTeZluMinZ1nMdCuGrX5VCxaFFMp/8aeDk/XVIoCjQtD5aC', 'gerente', true),
('35456789', 'Camila Torres', '1994-01-18', '2664556677', 'cm@mariabalbina.com', 'Junín 850, San Luis', '$2b$10$QemykBh3qpFNqqRivissB.4BkQChG4RMIzY0CZGNCI7F3v.ejF43.', 'CM', true);

-- INSERCION DE CLIENTES
INSERT INTO personas (pe_dni, pe_nombre, pe_fechaNac, pe_telefono, pe_mail, pe_direccion, pe_password, pe_rol, pe_activo)
VALUES 
('12345678', 'Lucia Gomez', '1990-05-10', '2664332211', 'lucia@gmail.com', 'San Martín 100, San Luis', '$2b$10$04hTBqwI7SxBizwSm0cgkOSDWbgONu6S0AH75/O7JCQDCfHu0dHWm', 'cliente', true),
('87654321', 'Martin Pedernera', '1985-11-20', '2664778899', 'martin@gmail.com', 'Rivadavia 500, San Luis', '$2b$10$04hTBqwI7SxBizwSm0cgkOSDWbgONu6S0AH75/O7JCQDCfHu0dHWm', 'cliente', true);

-- INSERCION DE PRODUCTOS
INSERT INTO productos 
(p_marca, p_tipo, p_precio, p_costo, p_anio, p_medida, p_bodega, p_varietal, p_stock, p_imagen_url, p_descripcion)
VALUES
('Trapiche', 'tinto', 6500.00, 3800.00, 2021, '750', 'Trapiche', 'Malbec', 0, '/img/productos/trapiche-malbec-750.png', 
'Un vino de color rojo violáceo brillante, con aromas a frutos rojos frescos como ciruelas y cerezas, complementados con sutiles notas avainilladas. En boca es suave, redondo, de taninos amables y final frutal muy agradable.'),

('Rutini', 'tinto', 18500.00, 11000.00, 2020, '750', 'Rutini Wines', 'Cabernet Sauvignon', 20, '/img/productos/rutini-cabernet-750.png', 
'Complejo y elegante exponente de Valle de Uco. Despliega aromas a frutas negras maduras, especias como pimienta negra y notas tostadas aportadas por su crianza en roble. Posee una estructura firme, taninos sedosos y excelente potencial de guarda.'),

('Luigi Bosca', 'tinto', 14200.00, 8500.00, 2022, '750', 'Luigi Bosca', 'Pinot Noir', 15, '/img/productos/luigi-bosca-pinot-750.png', 
'De color rojo rubí translúcido y brillante. Nariz muy expresiva con notas de cerezas, frambuesas y delicados dejos terrosos y florales. En boca se destaca por su frescura, sutileza, taninos delicados y gran fineza.'),

('Norton', 'blanco', 4800.00, 2700.00, 2023, '750', 'Bodega Norton', 'Sauvignon Blanc', 30, '/img/productos/norton-sauvignon-750.png', 
'Un vino blanco vivaz y refrescante, con claros tonos verdosos. En nariz predominan notas cítricas de pomelo, lima y sutiles estallidos herbales. En boca ofrece una acidez equilibrada que aporta vivacidad y un final limpio y persistente.'),

('Catena Zapata', 'tinto', 22000.00, 13500.00, 2019, '750', 'Catena Zapata', 'Malbec', 12, '/img/productos/catena-malbec-750.png', 
'Elaborado con uvas de viñedos de altura, ofrece una gran complejidad aromática de frutos negros maduros, notas de violetas, moca y especias dulces. De gran concentración en boca, taninos jugosos y una textura untuosa y sofisticada.'),

('Alamos', 'blanco', 5200.00, 3100.00, 2023, '750', 'Alamos', 'Torrontes', 25, '/img/productos/alamos-torrontes-750.png', 
'Fragante y sumamente aromático. Caracterizado por sus clásicas notas florales de azahar y jazmín, combinadas con toques cítricos y de frutas blancas de carozos. En boca es fresco, expresivo y con un paso armónico.'),

('Salentein', 'rosado', 7800.00, 4500.00, 2022, '750', 'Bodegas Salentein', 'Malbec Rose', 18, '/img/productos/salentein-rose-750.png', 
'Un rosé elegante de color piel de cebolla brillante. Nariz delicada con aromas a frutillas, cerezas frescas y notas florales. En boca muestra una excelente acidez natural que le otorga frescura y un perfil vibrante.'),

('Finca La Linda', 'tinto', 8900.00, 5200.00, 2021, '750', 'Luigi Bosca', 'Syrah', 28, '/img/productos/la-linda-syrah-750.png', 
'De color violáceo profundo e intenso. Presenta aromas especiados muy característicos, con notas de frutos negros, pimienta negra y tonos ahumados. En boca es concentrado, con taninos firmes y de gran personalidad.'),

('Trapiche', 'blanco', 6100.00, 3500.00, 2022, '750', 'Trapiche', 'Chardonnay', 22, '/img/productos/trapiche-chardonnay-750.png', 
'Un blanco accesible y fresco, con aromas a manzana verde, pera y sutiles notas tropicales de ananá. En boca es untuoso pero equilibrado por una vivaz acidez que realza su perfil frutado.'),

('Rutini', 'blanco', 17000.00, 9800.00, 2022, '750', 'Rutini Wines', 'Chardonnay', 14, '/img/productos/rutini-chardonnay-750.png', 
'De gran complejidad gracias a su paso parcial por barricas de roble. Combina notas de frutas maduras como ananá y durazno blanco con matices de vainilla y manteca. En boca es estructurado, elegante y cremoso.'),

('Catena Zapata', 'blanco', 21000.00, 12500.00, 2021, '750', 'Catena Zapata', 'Chardonnay', 10, '/img/productos/catena-chardonnay-750.png', 
'Proveniente de viñedos de altura, ofrece una nariz cítrica punzante con notas de pera, manzana verde y notas minerales. Su paso por roble le aporta cuerpo, textura sedosa y un final largo y persistente.'),

('Alamos', 'tinto', 5800.00, 3300.00, 2022, '750', 'Alamos', 'Malbec', 35, '/img/productos/alamos-malbec-750.png', 
'Vino estructurado y accesible que refleja la tipicidad del Malbec mendocino. Cuenta con notas de ciruelas maduras, moras y toques de chocolate. En boca tiene taninos redondos y un carácter amable.'),

('Salentein', 'tinto', 9500.00, 5600.00, 2020, '750', 'Bodegas Salentein', 'Cabernet Sauvignon', 16, '/img/productos/salentein-cabernet-750.png', 
'Con expresión típica de Valle de Uco, destaca notas de cassis, pimiento morrón asado y especias. En boca presenta buen cuerpo, taninos firmes y maduros, con un elegante final especiado.'),

('Norton', 'tinto', 5100.00, 2900.00, 2021, '750', 'Bodega Norton', 'Merlot', 24, '/img/productos/norton-merlot-750.png', 
'Un tinto amigable y redondo. Ofrece aromas francos a frutos rojos maduros, ciruelas y sutiles notas de especias dulces. En boca se destaca por su paso amable, taninos suaves y gran versatilidad gastronómica.'),

('Luigi Bosca', 'blanco', 13900.00, 8100.00, 2022, '750', 'Luigi Bosca', 'Riesling', 9, '/img/productos/luigi-bosca-riesling-750.png', 
'Un exponente blanco sofisticado y aromático, con notas cítricas marcadas, toques minerales y sutiles notas florales. En boca muestra una acidez vibrante, excelente tensión y un final fresco muy persistente.'),

('Finca La Linda', 'blanco', 8500.00, 4900.00, 2023, '750', 'Luigi Bosca', 'Viognier', 19, '/img/productos/la-linda-viognier-750.png', 
'Vino blanco expresivo de color amarillo verdoso brillante. Destacan aromas a duraznos blancos, damascos y sutiles notas florales. En boca es untuoso, fresco, con volumen y un retrogusto sumamente frutal.'),

('Trapiche', 'tinto', 12000.00, 7000.00, 2019, '1500', 'Trapiche', 'Malbec', 5, '/img/productos/trapiche-magnum-1500.png', 
'Versión en formato Magnum de este clásico Malbec mendocino. Concentra aromas a frutos rojos y negros maduros, con toques de roble. En boca es amplio, estructurado, redondo y de gran capacidad para compartir.'),

('Rutini', 'tinto', 24000.00, 14500.00, 2018, '750', 'Rutini Wines', 'Malbec', 8, '/img/productos/rutini-apartado-750.png', 
'Un vino de alta gama complejo y exclusivo. Despliega una paleta aromática rica en frutos negros confitados, notas de tabaco, chocolate y especias finas. En boca es voluptuoso, potente, de taninos terciopelados y gran profundidad.');

-- INSERCION DE PLANES
INSERT INTO planes (ps_nombre, ps_descripcion, ps_cantidad_vinos, ps_valor, ps_activo)
VALUES
('Malbec', 'Ideal para quienes desean iniciarse en el mundo del vino y descubrir nuevas etiquetas cada mes.', 2, 25000.00, TRUE),
('Malbec-Rosado', 'La opción perfecta para paladares curiosos que buscan dar un salto de calidad y disfrutar de mayor variedad.', 3, 40000.00, TRUE),
('Reserva Especial', 'La experiencia definitiva para los verdaderos amantes y conocedores de vinos de alta gama.', 5, 70000.00, TRUE);

-- INSERCION DE VENTAS
INSERT INTO ventas (v_codigo, v_fecha, cliente_id, personal_id, evento_id, v_total, v_metodo_pago)
VALUES 
(
    'VTA-1712', 
    '2026-10-02 14:30:00', 
    (SELECT pe_id FROM personas WHERE pe_dni = '12345678'), 
    (SELECT pe_id FROM personas WHERE pe_dni = '28123456'), 
    NULL, 
    35000.00, 
    'Efectivo'
),
(
    'VTA-1823', 
    '2026-10-03 18:00:00', 
    (SELECT pe_id FROM personas WHERE pe_dni = '87654321'), 
    (SELECT pe_id FROM personas WHERE pe_dni = '31987654'), 
    NULL, 
    24000.00, 
    'MercadoPago'
);

-- INSERCION DE RENGLONES DE VENTA
INSERT INTO reglones_venta (venta_codigo, producto_codigo, iv_cantidad, iv_precio_unidad)
VALUES 
('VTA-1712', 1, 2, 6500.00),  
('VTA-1712', 5, 1, 22000.00),  
('VTA-1823', 18, 1, 24000.00);