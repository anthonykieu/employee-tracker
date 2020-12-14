const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

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
                    'Update Employee Information',
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
                    // const departmentInfo = await getDepartmentInfo();
                    // await addDepartment(departmentInfo);
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
        function (err, results, fields) {
            if (err) throw err;
            console.table(results);
            questionPrompt();
        })
};

const rolesTable = () => {
    connection.query(`SELECT id AS 'ID', title AS 'Title', department_id AS 'Dept ID', salary AS 'Salary' FROM roles`,
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


const getManager = () => {
    const query = 'SELECT employee.id AS "id", last_name, first_name, role_id, roles.title FROM employee LEFT JOIN roles ON employee.role_id = roles.id WHERE title LIKE "%Manager%"';
    
    connection.query(query,
        function (err, results, fields) {
            if (err) throw err;

            results.forEach(employee => {
                managerArray.push({ id: employee.id, name: `${employee.first_name} ${employee.last_name}`, role_id: employee.role_id, jobTitle: employee.title });
            })
            console.log('managerArray :', managerArray);
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
            console.log('roleArray :', roleArray);
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
                    // console.log(res.affectedRows);
                    questionPrompt();
                })
            console.log(query.sql);
        })
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
                    // console.log(res.affectedRows);
                    questionPrompt();
                })
            console.log(query.sql);
        })
}

function exit() {
    connection.end();
}