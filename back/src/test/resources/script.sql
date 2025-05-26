DROP TABLE IF EXISTS `PARTICIPATE`;
DROP TABLE IF EXISTS `SESSIONS`;
DROP TABLE IF EXISTS `TEACHERS`;
DROP TABLE IF EXISTS `USERS`;
CREATE TABLE `TEACHERS` (
                            `id` INT PRIMARY KEY AUTO_INCREMENT,
                            `last_name` VARCHAR(40),
                            `first_name` VARCHAR(40),
                            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `SESSIONS` (
                            `id` INT PRIMARY KEY AUTO_INCREMENT,
                            `name` VARCHAR(50),
                            `description` VARCHAR(2000),
                            `date` TIMESTAMP,
                            `teacher_id` int,
                            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `USERS` (
                         `id` INT PRIMARY KEY AUTO_INCREMENT,
                         `last_name` VARCHAR(40),
                         `first_name` VARCHAR(40),
                         `admin` BOOLEAN NOT NULL DEFAULT false,
                         `email` VARCHAR(255),
                         `password` VARCHAR(255),
                         `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `PARTICIPATE` (
                               `user_id` INT,
                               `session_id` INT
);

ALTER TABLE `SESSIONS` ADD FOREIGN KEY (`teacher_id`) REFERENCES `TEACHERS` (`id`);
ALTER TABLE `PARTICIPATE` ADD FOREIGN KEY (`user_id`) REFERENCES `USERS` (`id`);
ALTER TABLE `PARTICIPATE` ADD FOREIGN KEY (`session_id`) REFERENCES `SESSIONS` (`id`);


INSERT INTO TEACHERS (first_name, last_name)
VALUES ('Margot', 'DELAHAYE'),
       ('Hélène', 'THIERCELIN');

INSERT INTO SESSIONS (name,description,`date`,teacher_id,created_at,updated_at)
VALUES ('Yoga','First session','2023-04-05 10:13:16',1,'2023-04-04 10:13:16','2023-04-04 10:13:39'),
       ('Zoumba','Second session','2023-04-06 10:13:16',2,'2023-04-04 10:14:08','2023-04-04 10:14:08');

INSERT INTO USERS (first_name, last_name, admin, email, password)
VALUES ('Admin', 'Admin', true, 'yoga@studio.com', '$2a$10$iubE9N0INEpjueHwqfKJq.d/Dr2QpWc3l91Z.v7nH1uBMcDdH4X4.'),
       ('lasalle', 'degym', true, 'gym@studio.com', '$2a$10$WWUaHpk6yi9PKDmAv/BekejHy14u.ahqw8HjHmlm7NgKy9xOXs9p.');


INSERT INTO PARTICIPATE (user_id,session_id) VALUES (1,1);