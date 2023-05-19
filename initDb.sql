drop database shoes_shop

CREATE DATABASE shoes_shop;
USE shoes_shop;

CREATE TABLE account (
    avatar varchar(255) ,
    account_id INT PRIMARY KEY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(500) NOT NULL,
    role_account INT default 0,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    avatar_url VARCHAR(255) default 'GUEST' ,
    phone_number VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    employee_id INT,
    account_id INT,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (account_id) REFERENCES account(account_id)
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
    item_id INT,
    account_id INT,
    FOREIGN KEY (item_id) REFERENCES item (item_id),
    FOREIGN KEY (account_id) REFERENCES account (account_id),
    type int default 0
);

CREATE TABLE order_detail (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY;
    status varchar(255) NOT NULL default 'preparing',
    item_id int,
    order_id INT,
    phone_number VARCHAR(255),
    name_client VARCHAR(255),
    email_client VARCHAR(255),
    price FLOAT not null,
    address varchar(255),
    user_note TEXT,
    name_item VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    status VARCHAR(255) default 'Wait to confirmation',
    status_process int 0,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES `order` (order_id)
    FOREIGN KEY (item_id) REFERENCES `item` (item_id)
);

CREATE TABLE item_sale (
    sale_id INT PRIMARY KEY KEY AUTO_INCREMENT,
    date_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_end TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    price_sale FLOAT NOT NULL,
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



INSERT INTO `item` (`item_id`, `name`, `branch_id`) VALUES (11, "Nike Air Force 1 '07 Men's Shoes", 1);

INSERT INTO `item_detail` (`quantity`, `cost`, `status`, `color`, `brand`, `size`, `type`, `gender`, `age`, `des`, `item_id`) VALUES (4, 45, '99%', 'white', 'nike', 42, 'sneaker', 'unisex', 'all', "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.", 11);

INSERT INTO `photo_item` (`link_photo`, `item_id`) VALUES ('https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png', 11);
INSERT INTO `photo_item` (`link_photo`, `item_id`) VALUES ('https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/00375837-849f-4f17-ba24-d201d27be49b/air-force-1-07-shoes-WrLlWX.png', 11);
INSERT INTO `photo_item` (`link_photo`, `item_id`) VALUES ('https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/3cc96f43-47b6-43cb-951d-d8f73bb2f912/air-force-1-07-shoes-WrLlWX.png', 11);
INSERT INTO `photo_item` (`link_photo`, `item_id`) VALUES ('https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/33533fe2-1157-4001-896e-1803b30659c8/air-force-1-07-shoes-WrLlWX.png', 11);
INSERT INTO `photo_item` (`link_photo`, `item_id`) VALUES ('https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/a0a300da-2e16-4483-ba64-9815cf0598ac/air-force-1-07-shoes-WrLlWX.png', 11);
INSERT INTO `photo_item` (`link_photo`, `item_id`) VALUES ('https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/82aa97ed-98bf-4b6f-9d0b-31a9f907077b/air-force-1-07-shoes-WrLlWX.png', 11);
INSERT INTO `photo_item` (`link_photo`, `item_id`) VALUES ('https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/120a31b0-efa7-41c7-9a84-87b1e56ab9c3/air-force-1-07-shoes-WrLlWX.png', 11);


INSERT INTO item (item_id, name, branch_id) VALUES (12, 'Wild Rider Layers Unisex Sneakers', 1);
INSERT INTO item_detail (quantity, cost, status, color, brand, type, des, gender, age, item_id) VALUES (10, 121, '90%', 'black', 'Puma', 'sneakers', 'Premium leather and suede mix with hairy suede on a nylon upper for a raw edgy look', 'unisex', 'all', 11);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/380697/02/sv01/fnd/IND/fmt/png/,Wild-Rider-Layers-Unisex-Sneakers', 12);

INSERT INTO item (item_id, name, branch_id) VALUES (15,'Wild Rider Layers 2 Unisex Sneakers', 1);

INSERT INTO item_detail (quantity, cost, status, color, brand, type, gender, age, des, item_id) 
VALUES (1, 151.0, '99%', NULL, 'puma', 'Sneaker', 'unisex', 'all', 'With design elements inspired by the movement and motion of city life, the Wild Rider Layers Unisex. With design elements inspired by the movement and motion of city life, the Wild Rider Layers Unisex Sneakers brings a fresh new dimension to the iconic Rider family.', 15);

INSERT INTO photo_item (link_photo, item_id) 
VALUES ('https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/380697/03/sv01/fnd/IND/fmt/png/Wild-Rider-Layers-Unisex-Sneakers', 14);


INSERT INTO item (item_id, name, branch_id) VALUES (16,'Nike Air Max Pulse', 1);

INSERT INTO item_detail (quantity, cost, status, color, brand, type, gender, age, des, item_id) 
VALUES (1, 121, '99%', 'gray', 'nike', 'Sneaker', 'female', 'all', "Keeping it real, the Air Max Pulse pulls inspiration from the London music scene, bringing an underground touch to the iconic Air Max line. Its textile-wrapped midsole and vacuum-sealed accents keep 'em looking fresh and clean, while colours inspired by the London music scene give your look the edge. Point-loaded Air cushioning—revamped from the incredibly plush Air Max 270—delivers better bounce, helping you push past your limits. ", 16);

INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/48d7caab-fc8d-4a2c-9050-58e58f7155dc/air-max-pulse-shoes-V9B1C5.png', 16);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/ed1da0cb-92ad-449f-b94e-39cc02db29e5/air-max-pulse-shoes-V9B1C5.png', 16);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/49413ab1-a863-417a-b0e8-1476c3a204cb/air-max-pulse-shoes-V9B1C5.png', 16);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/586a9153-d2a4-4be8-b006-a44fdf60e0d0/air-max-pulse-shoes-V9B1C5.png', 16);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d2b3b2de-7f8a-4937-a46d-d0297d81e300/air-max-pulse-shoes-V9B1C5.png', 16);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/915ed5b1-94eb-4661-9e3f-c6d333e4e8ca/air-max-pulse-shoes-V9B1C5.png', 16);



INSERT INTO item (item_id, name, branch_id) VALUES (17,'Nike Air Max Pulse', 1);

INSERT INTO item_detail (size, quantity, cost, status, color, brand, type, gender, age, des, item_id) 
VALUES (39,1, 121, '99%', 'gray', 'nike', 'Sneaker', 'female', 'all', "Keeping it real, the Air Max Pulse pulls inspiration from the London music scene, bringing an underground touch to the iconic Air Max line. Its textile-wrapped midsole and vacuum-sealed accents keep 'em looking fresh and clean, while colours inspired by the London music scene give your look the edge. Point-loaded Air cushioning—revamped from the incredibly plush Air Max 270—delivers better bounce, helping you push past your limits. ", 17);

INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/48d7caab-fc8d-4a2c-9050-58e58f7155dc/air-max-pulse-shoes-V9B1C5.png', 17);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/ed1da0cb-92ad-449f-b94e-39cc02db29e5/air-max-pulse-shoes-V9B1C5.png', 17);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/49413ab1-a863-417a-b0e8-1476c3a204cb/air-max-pulse-shoes-V9B1C5.png', 17);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/586a9153-d2a4-4be8-b006-a44fdf60e0d0/air-max-pulse-shoes-V9B1C5.png', 17);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d2b3b2de-7f8a-4937-a46d-d0297d81e300/air-max-pulse-shoes-V9B1C5.png', 17);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/915ed5b1-94eb-4661-9e3f-c6d333e4e8ca/air-max-pulse-shoes-V9B1C5.png', 17);

INSERT INTO item (item_id, name, branch_id) VALUES (18,'Nike Air Max Pulse', 1);

INSERT INTO item_detail (size, quantity, cost, status, color, brand, type, gender, age, des, item_id) 
VALUES (40,1, 121, '99%', 'gray', 'nike', 'Sneaker', 'female', 'all', "Keeping it real, the Air Max Pulse pulls inspiration from the London music scene, bringing an underground touch to the iconic Air Max line. Its textile-wrapped midsole and vacuum-sealed accents keep 'em looking fresh and clean, while colours inspired by the London music scene give your look the edge. Point-loaded Air cushioning—revamped from the incredibly plush Air Max 270—delivers better bounce, helping you push past your limits. ", 18);

INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/48d7caab-fc8d-4a2c-9050-58e58f7155dc/air-max-pulse-shoes-V9B1C5.png', 18);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/ed1da0cb-92ad-449f-b94e-39cc02db29e5/air-max-pulse-shoes-V9B1C5.png', 18);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/49413ab1-a863-417a-b0e8-1476c3a204cb/air-max-pulse-shoes-V9B1C5.png', 18);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/586a9153-d2a4-4be8-b006-a44fdf60e0d0/air-max-pulse-shoes-V9B1C5.png', 18);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d2b3b2de-7f8a-4937-a46d-d0297d81e300/air-max-pulse-shoes-V9B1C5.png', 18);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/915ed5b1-94eb-4661-9e3f-c6d333e4e8ca/air-max-pulse-shoes-V9B1C5.png', 18);


INSERT INTO item (item_id, name, branch_id) VALUES (19, 'Nike Air Max Pulse', 1);

INSERT INTO item_detail (size, quantity, cost, status, color, brand, type, gender, age, des, item_id) 
VALUES (41,1, 121, '99%', 'gray', 'nike', 'Sneaker', 'female', 'all', "Keeping it real, the Air Max Pulse pulls inspiration from the London music scene, bringing an underground touch to the iconic Air Max line. Its textile-wrapped midsole and vacuum-sealed accents keep 'em looking fresh and clean, while colours inspired by the London music scene give your look the edge. Point-loaded Air cushioning—revamped from the incredibly plush Air Max 270—delivers better bounce, helping you push past your limits. ", 19);

INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/48d7caab-fc8d-4a2c-9050-58e58f7155dc/air-max-pulse-shoes-V9B1C5.png', 19);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/ed1da0cb-92ad-449f-b94e-39cc02db29e5/air-max-pulse-shoes-V9B1C5.png', 19);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/49413ab1-a863-417a-b0e8-1476c3a204cb/air-max-pulse-shoes-V9B1C5.png', 19);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/586a9153-d2a4-4be8-b006-a44fdf60e0d0/air-max-pulse-shoes-V9B1C5.png', 19);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d2b3b2de-7f8a-4937-a46d-d0297d81e300/air-max-pulse-shoes-V9B1C5.png', 19);
INSERT INTO photo_item (link_photo, item_id) VALUES ('https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/915ed5b1-94eb-4661-9e3f-c6d333e4e8ca/air-max-pulse-shoes-V9B1C5.png', 19);
DELIMITER $$
CREATE TRIGGER delete_item_trigger
BEFORE DELETE ON item
FOR EACH ROW
BEGIN
    DELETE FROM item_detail WHERE item_detail.item_id = OLD.item_id;
    DELETE FROM item_sale WHERE item_sale.item_id = OLD.item_id;
END $$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER update_item_quantity_trigger
AFTER INSERT ON order_detail
FOR EACH ROW
BEGIN
    DECLARE item_quantity INT;
    DECLARE order_quantity INT;
    DECLARE item_id INT;

    -- Lấy item_id từ bảng order
    SELECT item_id INTO item_id
    FROM `order`
    WHERE order_id = NEW.order_id;

    -- Lấy số lượng của item từ bảng item_detail
    SELECT quantity INTO item_quantity
    FROM item_detail
    WHERE item_id = item_id;

    -- Lấy số lượng từ order_detail
    SELECT quantity INTO order_quantity
    FROM order_detail
    WHERE item_id = item_id
    ORDER BY order_id DESC
    LIMIT 1;

    -- Kiểm tra nếu số lượng của item_detail lớn hơn số lượng trong order_detail
    IF item_quantity > order_quantity THEN
        -- Cập nhật lại quantity cần thiết trong item_detail
        UPDATE item_detail
        SET quantity = item_quantity - order_quantity
        WHERE item_id = item_id;
    ELSE
        -- Xóa item khỏi bảng item
        DELETE FROM item
        WHERE item_id = item_id;
    END IF;
END $$
DELIMITER ;
