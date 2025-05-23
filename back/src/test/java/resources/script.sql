INSERT INTO test.teachers (id, last_name, first_name, created_at, updated_at) VALUES (3, 'Doe', 'John', '2024-06-08 16:35:30', '2024-06-08 16:35:30');
INSERT INTO USERS (id, first_name, last_name, admin, email, password)
SELECT 2, 'John', 'Doe', true, 'john.doe@example.com', 'A complex password'
    WHERE NOT EXISTS (
    SELECT 1 FROM USERS WHERE email = 'john.doe@example.com'
);

INSERT INTO USERS (id, first_name, last_name, admin, email, password)
SELECT 3, 'Lorem', 'Ipsum', true, 'lorem.ipsum@example.com', 'A complex password'
    WHERE NOT EXISTS (
    SELECT 1 FROM USERS WHERE email = 'lorem.ipsum@example.com'
);