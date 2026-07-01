CREATE DATABASE IF NOT EXISTS acme;
USE acme;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL,
    userEmail VARCHAR(255) NOT NULL UNIQUE,
    userPassword VARCHAR(255),
    userImg TEXT,
    userRole VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS productos (
    productId INT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(255) NOT NULL,
    productCode VARCHAR(50) NOT NULL,
    releaseDate VARCHAR(50),
    price INT,
    description TEXT,
    starRating FLOAT,
    imageUrl TEXT
);

INSERT INTO productos (productId, productName, productCode, releaseDate, price, description, starRating, imageUrl) VALUES
(1, 'Zapatillas de lona', 'GDN-0011', '2018-11-05', 20, 'Zapatillas de lona con caña marca Converse.', 42.2, 'https://images-na.ssl-images-amazon.com/images/I/41OjoF2YV6L._SX395_QL70_.jpg'),
(2, 'Bolso de cuero', 'GDN-0023', '2019-02-20', 33, 'Bolso de cuero, con forro de seda.', 87.2, ''),
(3, 'Reloj antiguo', 'TBX-0048', '2017-08-15', 9, 'Reloj blanco de dos campanillas tipo retro.', 4.8, 'https://www.relojesdemoda.com/images/productos/reloj-despertador-seiko-qhk035g-1-88622.jpeg'),
(4, 'Cámara fotográfica', 'TBX-0022', '2019-02-27', 12, 'Cámara fotográfica digital con Zoom óptico y 16 GB de RAM interna.', 185.7, 'https://www.fotomecanica.mx/media/catalog/product/cache/1/image/650x/040ec09b1e35df139433887a97daa66f/e/a/easycover_for_nikon_d5500_-_12.jpg'),
(5, 'Taladro de percusión', 'GMG-0042', '2016-09-06', 36, 'Taladro eléctrico de percusión, 200 RPM, marca DrillBill', 123.6, 'https://d26lpennugtm8s.cloudfront.net/stores/138/995/products/13200121-300edb4babe7a9f2d615132808324913-1024-1024.jpg');
