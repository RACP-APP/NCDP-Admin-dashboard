CREATE DATABASE NCDP;

USE NCDP;
CREATE TABLE USERS
(
  /* Describe your table here.*/
  userID INT
  auto_increment PRIMARY  KEY,
  password VARCHAR
  (500) NOT NULL,
  userName VARCHAR
  (100) NOT NULL,
  salt VARCHAR
  (100) NOT NULL,
  email VARCHAR
  (100) NOT NULL
);