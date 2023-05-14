drop database shoes_shop

CREATE DATABASE shoes_shop;
USE shoes_shop;

CREATE TABLE account (
    avatar varchar(255) ,
    account_id INT PRIMARY KEY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(500) NOT NULL,
    role_account INT default 0
);

CREATE TABLE branch_store (
    branch_id INT PRIMARY KEY KEY AUTO_INCREMENT,
    hotline VARCHAR(20) NOT NULL,
    name VARCHAR(255) UNIQUE,
    address VARCHAR(255) NOT NULL,
    tax_code VARCHAR(255) default 'T6H2F8E1G7'
);

CREATE TABLE `user` (
    user_id INT PRIMARY KEY KEY AUTO_INCREMENT,
    sign_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    account_id INT,
    FOREIGN KEY (account_id) REFERENCES account(account_id)
);

CREATE TABLE employee (
    employee_id INT PRIMARY KEY KEY AUTO_INCREMENT,
    role INT NOT NULL,
    salary INT NOT NULL,
    account_id INT,
    branch_id INT,
    FOREIGN KEY (account_id) REFERENCES account(account_id),
    FOREIGN KEY (branch_id) REFERENCES branch_store(branch_id)
);

CREATE TABLE profile (
    avatar_url VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    employee_id INT,
    user_id INT,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE item (
    item_id INT PRIMARY KEY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    branch_id INT,
    FOREIGN KEY (branch_id) REFERENCES branch_store(branch_id)
);

CREATE TABLE photo_item (
    link_photo VARCHAR(500) NOT NULL,
    item_id Int ,
    FOREIGN KEY (item_id) REFERENCES item(item_id)
    type VARCHAR(255) DEFAULT 'normal'
);

CREATE TABLE item_detail (
    item_detail_id INT PRIMARY KEY  AUTO_INCREMENT,
    quantity INT NOT NULL,
    cost FLOAT NOT NULL,
    status VARCHAR(255) default 'unknown',
    color VARCHAR(255),
    brand VARCHAR(255) NOT NULL DEFAULT 'unknown origin',
     INT NOT NULL,
    type VARCHAR(255) not null,
    des text ,
    gender VARCHAR(255) default 'unisex',
    age varchar(255) not null,
    add_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    item_id INT,
    FOREIGN KEY (item_id) REFERENCES item(item_id)
);

CREATE TABLE supplier (
    supplier_id INT PRIMARY KEY KEY AUTO_INCREMENT,
    address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE stock_in (
    stock_in_id INT PRIMARY KEY KEY AUTO_INCREMENT,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    quantity INT NOT NULL,
    employee_id INT,
    supplier_id INT,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
);

CREATE TABLE stock_in_detail (
    stock_in_detail_id INT PRIMARY KEY KEY AUTO_INCREMENT,
    quantity INT NOT NULL,
    item_id INT,
    stock_in_id INT,
    FOREIGN KEY (item_id) REFERENCES item(item_id),
    FOREIGN KEY (stock_in_id) REFERENCES stock_in(stock_in_id)
);

CREATE TABLE `order` (
    order_id INT PRIMARY KEY KEY AUTO_INCREMENT,
    type_order BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE order_detail (
    status varchar(255) NOT NULL default 'preparing',
    order_id INT,
    phone_number VARCHAR(255),
    name_client VARCHAR(255),
    email_client VARCHAR(255),
    total FLOAT not null,
    address varchar(255),
    item_id INT,
    user_id INT,
    user_note TEXT,
    name_item VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES `order` (order_id),
    FOREIGN KEY (item_id) REFERENCES item (item_id),
    FOREIGN KEY (user_id) REFERENCES user (user_id)
);

CREATE TABLE item_sale (
    sale_id INT PRIMARY KEY KEY AUTO_INCREMENT,
    date_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_end TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    price_sale INT NOT NULL,
    item_id INT,
    FOREIGN KEY (item_id) REFERENCES item (item_id)
);

CREATE TABLE review (
    review_id INT PRIMARY KEY KEY AUTO_INCREMENT,
    review_content TEXT,
    rank FLOAT,
    user_id INT,
    item_id INT,
    FOREIGN KEY (user_id) REFERENCES user (user_id),
    FOREIGN KEY (item_id) REFERENCES item (item_id)
);

INSERT INTO branch_store (hotline, name, address) VALUES ('1900-1111', 'TP Ho Chi Minh', '30/38 Lam Van Ben, Quan 7, TP HCM');
INSERT INTO branch_store (hotline, name, address) VALUES ('1900-1112', 'TP Ha Noi', '30/38 Tây Hồ, Hà Nội, Việt Nam.');

