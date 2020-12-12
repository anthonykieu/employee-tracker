DROP DATABASE IF EXISTS trackerDB;
CREATE DATABASE trackerDB;
USE trackerDB;

CREATE TABLE departments(
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30)
);

CREATE TABLE roles(
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  -- FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employee(
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  -- FOREIGN KEY (role_id) REFERENCES roles(id),
  -- manager_id REFERENCES employee(id),
);



