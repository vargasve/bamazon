DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE forSale(
	id INT auto_increment NOT NULL,
	product VARCHAR(50) NOT NULL,
    department VARCHAR(50),
	price INT DEFAULT 0,
	stock INT DEFAULT 0,
  	PRIMARY KEY (id)
);