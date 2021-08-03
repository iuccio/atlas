CREATE TABLE CUSTOMERS (
                           id int not null,
                           firstname VARCHAR(255),
                           lastname VARCHAR(255)
);

CREATE SEQUENCE CUSTOMERS_SEQUENCE START WITH 1000 INCREMENT BY 1;

INSERT INTO CUSTOMERS (id,firstname, lastname) VALUES (nextval('CUSTOMERS_SEQUENCE'),'Antonio', 'Romano');
INSERT INTO CUSTOMERS (id,firstname, lastname) VALUES (nextval('CUSTOMERS_SEQUENCE'),'Diego Armando', 'Maradona');
INSERT INTO CUSTOMERS (id,firstname, lastname) VALUES (nextval('CUSTOMERS_SEQUENCE'),'Zinedine', 'Zidane');
INSERT INTO CUSTOMERS (id,firstname, lastname) VALUES (nextval('CUSTOMERS_SEQUENCE'),'Valentino', 'Rossi');