DROP DATABASE IF EXISTS trackerDB;
CREATE DATABASE trackerDB;
USE trackerDB;
DROP Table IF EXISTS departments;
DROP Table IF EXISTS roles;
DROP Table IF EXISTS manager;
DROP Table IF EXISTS employee;


CREATE TABLE departments(
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30)
);

CREATE TABLE roles(
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE manager(
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR(30)
);

CREATE TABLE employee(
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES manager(id)
);

