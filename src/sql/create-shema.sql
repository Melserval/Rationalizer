-- создание базы данных и основных таблиц.
CREATE DATABASE rationalizer;
USE rationalizer;

-- тип или вид единицы измерения содержимого (грамм, миллиитр, миллиметр и так далее).
CREATE TABLE type_measure (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	type_name VARCHAR(50) NOT NULL UNIQUE,
	label_full VARCHAR(20),
	label_short VARCHAR(5),
	`description` VARCHAR(255)
);

-- тип или вид распостранения (весовой, фасованный, штучний и так далее).
CREATE TABLE type_package (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	type_name VARCHAR(50) NOT NULL UNIQUE,
	label_full VARCHAR(20),
	label_short VARCHAR(5),
	`description` VARCHAR(255)
);

-- единица  продукта
CREATE TABLE product (
	id CHAR(9) NOT NULL UNIQUE,
	title VARCHAR(255) NOT NULL,
	amount INT NOT NULL DEFAULT 1,
	price DECIMAL(9, 2) NOT NULL DEFAULT 0.0,
	`description` TEXT,
	package_id INT NOT NULL,
	measure_id INT NOT NULL,
	CONSTRAINT product_pakage_FK FOREIGN KEY (package_id) REFERENCES type_package (id),
	CONSTRAINT product_measure_FK FOREIGN KEY (measure_id) REFERENCES type_measure (id)
);

-- финансовый период
CREATE TABLE budget_period (
	id CHAR(8) NOT NULL UNIQUE,
	period_start DATE NOT NULL DEFAULT (CURRENT_DATE()),
	period_end DATE DEFAULT NULL,
	resources_deposit DECIMAL(9, 2) NOT NULL DEFAULT 0.0,
	resources_reserved DECIMAL(9, 2) NOT NULL DEFAULT 0.0,
	resources_utilize DECIMAL(9, 2) NOT NULL DEFAULT 0.0,
	exchange DECIMAL(9, 2) NOT NULL DEFAULT 1.0
);

-- список приобритаемого
CREATE TABLE order_list (
	id CHAR(8) NOT NULL UNIQUE,
	created TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP()),
	quantity INT NOT NULL DEFAULT 0,
	total DECIMAL(9, 2) NOT NULL DEFAULT 0.0,
	term INT,
	label VARCHAR(255)
);

-- Приобритаемый продукт.
CREATE TABLE purshase (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	order_id CHAR(8) NOT NULL,
	product_id CHAR(9) NOT NULL,
	quantity INT NOT NULL,
	purshase_price DECIMAL(9, 2) DEFAULT NULL, -- Если NULL значит покупка еще не совершена.
	CONSTRAINT orders_product_FK FOREIGN KEY (product_id) REFERENCES product (id),
	CONSTRAINT orders_order_FK FOREIGN KEY (order_id) REFERENCES order_list (id)
);

-- категории для продукта
CREATE TABLE category_product (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(30) NOT NULL
);

-- категории продукта
CREATE TABLE product_categories (
	product_id CHAR(9) NOT NULL,
	category_id INT NOT NULL,
	CONSTRAINT product_categories_FK FOREIGN KEY (product_id) REFERENCES product (id),
	CONSTRAINT category_categories_FK FOREIGN KEY (category_id) REFERENCES category_product (id)
);

-- таблица отношений заказов к периоду.
CREATE TABLE orders_of_budget (
	order_id char(8) NOT NULL,
	period_id CHAR(8) NOT NULL,
	PRIMARY KEY(order_id, period_id)
);

-- Выборка продуктов
CREATE VIEW assortiment AS 
SELECT 
	p.id, 
	p.title, 
	p.amount, 
	p.price,
	p.`description`,
	v.type_name, 
	m.type_name as m_typename
FROM 
	product AS p
INNER JOIN 
	type_measure AS m  ON m.id = p.measure_id 
INNER JOIN type_package AS v ON v.id = p.package_id;

-- Выборка списков закупок.
