const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');
const logo = require('asciiart-logo');

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

console.log(
    logo({
        name: 'THE Employee Tracker',
        font: 'ANSI Shadow',
        lineChars: 15,
        padding: 2,
        margin: 2,
        borderColor: 'white',
        logoColor: 'white',
    })
    .render()
);

let departmentArray = [];
let employeeArray = [];
let roleArray = [];
let managerArray = [];

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
                    'Update Employee Role',
                    'Exit'
                ],
            }
        ]).then(promptSelection => {

            switch (promptSelection.selection) {
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
                    addDept();
                    break;

                case 'Add a New Role':
                    getDept();
                    setTimeout(addRole, 500);
                    break;

                case 'Add New Employee':
                    getRole();
                    getManager();
                    setTimeout(addEmployee, 500);
                    break;

                case 'Update Employee Role':
                    getRole();
                    getEmployee();
                    setTimeout(updateEmployee, 500);
                    break;

                case 'Exit':
                    exit();
                    break;
            }
        })
};

const departmentTable = () => {
    connection.query('SELECT id AS "ID", dept_name AS Department FROM departments',
        function (err, results, fields) {
            if (err) throw err;
            console.table(results);
            questionPrompt();
        })
};

const rolesTable = () => {
    connection.query(`SELECT roles.id AS 'ID', roles.title AS 'Title', departments.dept_name AS 'Deparment', salary AS 'Salary' FROM roles LEFT JOIN departments ON roles.department_id = departments.id`,
        function (err, results, fields) {
            if (err) throw err;
            console.table(results);
            questionPrompt();
        })
};

const employeeTable = () => {
    const query = `
    SELECT employee.id AS "ID", employee.first_name AS "First Name", employee.last_name AS 'Last Name', roles.title AS 'Title', roles.salary AS 'Salary', departments.dept_name AS 'Department', CONCAT(manager.first_name, " ", manager.last_name) AS Manager
    FROM employee
    LEFT JOIN roles ON employee.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employee manager ON manager.id = employee.manager_id`;
    connection.query(query,
        function (err, results, fields) {
            if (err) throw err;
            console.table('\n', results, '\n');
            questionPrompt();
        })
};

const addDept = () => {
    inquirer
        .prompt({
            name: 'dept_name',
            type: 'input',
            message: 'Enter a new department name.',
        })
        .then(answer => {
            const query = connection.query('INSERT INTO departments SET ?',
                {
                    dept_name: answer.dept_name,
                },
                function (err, res, fields) {
                    if (err) throw err;
                    console.log(res.affectedRows);
                    questionPrompt();
                });
            console.log(query.sql);
        })
};

const getEmployee = () => {
    const query = 'SELECT employee.id AS "id", last_name, first_name, role_id, roles.title FROM employee LEFT JOIN roles ON employee.role_id = roles.id';
    
    connection.query(query,
        function (err, results, fields) {
            if (err) throw err;

            results.forEach(employee => {
                employeeArray.push({ id: employee.id, name: `${employee.first_name} ${employee.last_name}`, role_id: employee.role_id, jobTitle: employee.title });
            })
        });
};

const getManager = () => {
    const query = 'SELECT employee.id AS "id", last_name, first_name, role_id, roles.title FROM employee LEFT JOIN roles ON employee.role_id = roles.id WHERE title LIKE "%Manager%"';
    
    connection.query(query,
        function (err, results, fields) {
            if (err) throw err;

            results.forEach(employee => {
                managerArray.push({ id: employee.id, name: `${employee.first_name} ${employee.last_name}`, role_id: employee.role_id, jobTitle: employee.title });
            })
        });
};

const getRole = () => {
    const query = 'SELECT * FROM roles';
    connection.query(query,
        function (err, results, fields) {
            if (err) throw err;

            results.forEach(roles => {
                roleArray.push({ id: roles.id, title: roles.title, salary: roles.salary });
            })
        });
};

const getDept = () => {
    const query = 'SELECT * FROM departments';
    connection.query(query,
        function (err, results, fields) {
            if (err) throw err;

            results.forEach(dept => {
                departmentArray.push({ id: dept.id, dept_name: dept.dept_name });
            })
        });
};

const addRole = () => {

    inquirer
        .prompt([
            {
                name: 'roleName',
                type: 'input',
                message: 'What is the title of the role? ',
            },
            {
                name: 'salary',
                type: 'input',
                message: "What is salary of the role? ",
            },
            {
                name: 'roleDept',
                type: 'list',
                message: 'What department is the role in?',
                choices: departmentArray.map(dept => dept.dept_name),
            },
        ])
        .then(answer => {
            let deptId = departmentArray.filter(dept => dept.dept_name === answer.roleDept);
            const query = connection.query('INSERT INTO roles SET ?',
                {
                    title: answer.roleName,
                    salary: answer.salary,
                    department_id: deptId[0].id,
                },
                function (err, res, fields) {
                    if (err) throw err;
                    questionPrompt();
                })
        });
};

const addEmployee = () => {
    inquirer
        .prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the first name? ',
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the last name? ',
            },
            {
                name: 'empRole',
                type: 'list',
                message: 'What is their role?',
                choices: roleArray.map(role => role.title),
            },
            {
                name: 'empManager',
                type: 'list',
                message: 'Who is their manager?',
                choices: managerArray.map(manager => manager.name),
            },
        ])
        .then(answer => {
            let roleId = roleArray.filter(role => role.title === answer.empRole);
            let managerId = managerArray.filter(manager => manager.name === answer.empManager);
            const query = connection.query('INSERT INTO employee SET ?',
                {
                    last_name: answer.lastName,
                    first_name: answer.firstName,
                    role_id: roleId[0].id,
                    manager_id: managerId[0].id,
                },
                function (err, res, fields) {
                    if (err) throw err;
                    questionPrompt();
                })
        });
};

const updateEmployee = () => {
    inquirer
        .prompt([
            {
                name: 'selectEmployee',
                type: 'list',
                message: 'Whose role would you like to change? ',
                choices: employeeArray.map(employee => employee.name),
            },
            {
                name: 'updateRole',
                type: 'list',
                message: 'What is their new role?',
                choices: roleArray.map(role => role.title),
            },
        ])
        .then(answer => {
            let roleId = roleArray.filter(role => role.title === answer.updateRole);
            let employeeId = employeeArray.filter(employee => employee.name === answer.selectEmployee);
            const query = connection.query('UPDATE employee SET ? WHERE ?',
            [   
            {    
                    role_id: roleId[0].id,
            },
            {
                    id: employeeId[0].id,
                }
            ],
                function (err, res, fields) {
                    if (err) throw err;
                    questionPrompt();
                }
            )
        });
};

function exit() {
    connection.end();
}