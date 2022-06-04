----- | данные необходимые по умолчанию | ----

-- единицы измерения
INSERT INTO type_measure 
	(type_name, label_full, label_short)
VALUES
	("measureType_unit", "штука", "шт."),
    ("measureType_milliliter", "миллилитр", "ml."),
    ("MeasureType_liter", "литр", "l."),
    ("measureType_gramm", "грамм", "gr."),
    ("measureType_kilogramm", "килограмм", "kg."),
    ("measureType_kilowatt", 'киловатт', 'kw.');

-- типы фасовки (в каком виде распостраняется)
INSERT INTO type_package
	(type_name, label_full, label_short)
VALUES 
	("vendorType_unit", "штучный", "unt"),
    ("vendorType_packed", "фасованный", "pcg"),
    ("vendorType_weighed", "развесной", "wgh");

-- тестовые данные
INSERT INTO product 
    (title, amount, price, package_id, measure_id)
VALUES
    (
      "Вкусная колбаска '"'До пюрешки'"'", 
      500, 
      72.00, 
      (SELECT id FROM type_package WHERE type_name = "vendorType_packed"),
      (SELECT id FROM type_measure WHERE type_name = "measureType_gramm")
    ),
	(
		"Невкусная шинка '"'Кузьмич'"' (Колбасный Ряд)", 
		500, 
		48.60,
		(SELECT id FROM type_package WHERE type_name = "vendorType_packed"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_gramm")
	),
	(
		"Сгущенное молоко '"'Ичня'"'", 
		500, 
		67.50,
		(SELECT id FROM type_package WHERE type_name = "vendorType_packed"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_milliliter")
	),
	(
		"Хлеб 'Пшеничный', нарезной (Кулиничи)", 
		650, 
		21.40,
		(SELECT id FROM type_package WHERE type_name = "vendorType_packed"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_gramm")
	),
	(
		"Хлеб 'Пушкаревский', нарезной (Кулиничи)", 
		600, 
		21.40,
		(SELECT id FROM type_package WHERE type_name = "vendorType_packed"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_gramm")
	),
	(
		"Майонез '"'Домашний'"' (Торчин)", 
		580, 
		39.60,
		(SELECT id FROM type_package WHERE type_name = "vendorType_packed"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_gramm")
	),
	(
		"Кетчуп '"'Лагидный'"' (Торчин)", 
		450, 
		18.50,
		(SELECT id FROM type_package WHERE type_name = "vendorType_packed"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_gramm")
	),
	(
		"Витамины '"'Ундевит'"' упаковка 50 драже", 
		1, 
		22.60,
		(SELECT id FROM type_package WHERE type_name = "vendorType_unit"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_unit")
	),
	(
		"Витамины '"'Ундевит'"' упаковка 50 драже", 
		1, 
		22.60,
		(SELECT id FROM type_package WHERE type_name = "vendorType_unit"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_unit")
	),
	(
		"Таблетки '"'Парацетомол 500'"' упаковка 10 таблеток", 
		1, 
		26.40,
		(SELECT id FROM type_package WHERE type_name = "vendorType_unit"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_unit")
	),
	(
		"Хлеб 'Белорусский', нарезной (Киев Хлиб)", 
		700, 
		25.30,
		(SELECT id FROM type_package WHERE type_name = "vendorType_packed"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_gramm")
	),
	(
		"Картофель, сорт 2", 
		1, 
		7.60,
		(SELECT id FROM type_package WHERE type_name = "vendorType_weighed"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_kilogramm")
	),
	(
		"Морковь, сорт 1", 
		1, 
		7.90,
		(SELECT id FROM type_package WHERE type_name = "vendorType_weighed"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_kilogramm")
	),
	(
		"Свекла, сорт 1", 
		1, 
		8.40,
		(SELECT id FROM type_package WHERE type_name = "vendorType_weighed"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_kilogramm")
	),
	(
		"Оплата интернета", 
		1, 
		199.00,
		(SELECT id FROM type_package WHERE type_name = "vendorType_unit"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_unit")
	),
	(
		"Оплата электроэнергии", 
		1, 
		1.44,
		(SELECT id FROM type_package WHERE type_name = "vendorType_weighed"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_kilowatt")
	),
	(
		"Горох сухой, половинками (Розумный выбор)", 
		1, 
		16.60,
		(SELECT id FROM type_package WHERE type_name = "vendorType_packed"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_kilogramm")
	),
	(
		"Гречка (Розумный выбор)", 
		1, 
		39.90,
		(SELECT id FROM type_package WHERE type_name = "vendorType_packed"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_kilogramm")
	),
	(
		"Колбаса '"'Салями Премиум'"', варено-копченая (Добров)", 
		320, 
		77.70,
		(SELECT id FROM type_package WHERE type_name = "vendorType_packed"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_gramm")
	),
	(
		"Соль пищевая", 
		1.5, 
		7.70,
		(SELECT id FROM type_package WHERE type_name = "vendorType_packed"),
      	(SELECT id FROM type_measure WHERE type_name = "measureType_kilogramm")
	);