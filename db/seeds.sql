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

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Tony', 'Stark', 9, 2),
  ('Nick', 'Fury', 1, null),
  ('Steve', 'Rogers', 3, 2),
  ('Thor', 'Demi-god', 7, 2),
  ('Black', 'Widow', 5, 2),
  ('The', 'Hulk', 1, 11); 


