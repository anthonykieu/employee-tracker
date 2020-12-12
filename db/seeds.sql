USE trackerDB;
INSERT INTO departments (dept_name)
VALUES
  ('Accounting'),
  ('Marketing'),
  ('Administration'),
  ('IT'),
  ('Manufacturing');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('CEO', 400000, 3),
  ('VP', 200000, 3),
  ('ACT-Manager', 70000, 1),
  ('Accountant', 50000, 1),
  ('MKT-Manager', 70000, 2),
  ('MKT-Analyst', 40000, 2),
  ('ADM-Manager', 70000, 3),
  ('ADM-Analyst', 40000, 3),
  ('IT-Manager', 70000, 4),
  ('IT-Analyst', 40000, 4),
  ('MFG-Manager', 70000, 5),
  ('MFG-Analyst', 40000, 5);

INSERT INTO manager (name)
VALUES
  ('A K1'),
  ('A K2');

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Anthony1', 'Kieu1', 1, null),
  ('Anthony2', 'Kieu2', 2, 1),
  ('Anthony3', 'Kieu3', 3, 2),
  ('Anthony4', 'Kieu4', 4, 1),
  ('Anthony5', 'Kieu5', 5, 2),
  ('Anthony6', 'Kieu6', 6, 1),
  ('Anthony7', 'Kieu7', 7, 2),
  ('Anthony8', 'Kieu8', 8, 1),
  ('Anthony9', 'Kieu9', 9, 2),
  ('Anthony10', 'Kieu10', 10, 1),
  ('Anthony11', 'Kieu11', 11, 2),
  ('Anthony12', 'Kieu12', 12, 1); 


