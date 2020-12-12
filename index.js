const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: '2020Tennis02',
  database: 'trackerDB'
});

connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId + '\n');
  questionPrompt();
});

const questionPrompt = () => {

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'selection',
                message: 'Selection an action',
                choices: [
                    'Display Complete List of Company Departments',
                    'Display Complete List of Company Roles',
                    'Display Complete List of Employees',
                    new inquirer.Separator(),
                    'Add a New Department',
                    'Add a New Role',
                    'Add New Employee',
                    new inquirer.Separator(),
                    'Update Employee Information',
                    'Exit'
                ],
            }
        ]).then(promptSelection => {
        
            switch(promptSelection.selection) {
                case 'Display Complete List of Company Departments':
                    departmentTable();
                    break;
                
                case 'Display Complete List of Company Roles':
                    rolesTable();
                    break;

                case 'Display Complete List of Employees':
                    employeeTable();
                    break;

                case 'Add a New Department':
                    addDepartment();
                    break;

                case 'Add a New Role':
                    addRole();
                    break;

                case 'Add New Employee':
                    addEmployee();
                    break;

                case 'Update Employee Information':
                    updateEmployee();
                    break;
                
                case 'Exit':
                    exit();
                    break;
            }
        })
};

const departmentTable = () => {
    connection.query('SELECT id AS "ID", dept_name AS Department FROM departments',
    function(err, results, fields) {
        if (err) throw err;
        console.table(results);
        questionPrompt();
    })
};

const rolesTable = () => {
    connection.query(`SELECT id AS 'ID', title AS 'Title', department_id AS 'Dept ID', salary AS 'Salary' FROM roles`,
        function(err, results, fields) {
            if (err) throw err;
            console.table(results , '\n');
            questionPrompt();
        })
};

const employeeTable = () => {
    const query = `
    SELECT employee.id AS "ID", employee.first_name AS 'First Name', employee.last_name AS 'Last Name', roles.title AS 'Title', roles.salary AS 'Salary', employee.manager_id AS 'Manager ID',departments.dept_name AS 'Department'
    FROM employee
    LEFT JOIN roles ON employee.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id`;
    connection.query(query,
        function(err,results,fields) {
            if (err) throw err;
            console.table('\n', results, '\n');
            questionPrompt();
        })
};

const exit = () => {
    connection.end();
}