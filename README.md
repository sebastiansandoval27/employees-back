# Employees App BACKEND

## Idea

The main idea of the project is to organize the hierarchy of employees of a company, in such a way that the structure of the company and its employees can be visualized. In addition to including a versioning of the employees, so that you can see the history of changes of a specific employee. For this, a web application will be created to visualize the hierarchy of employees and the history of changes of a specific employee.

Explanation of the database model
The database model is composed of two tables, the employee table and the employee hierarchy table. The employee table contains the employee information such as name, role and version. The employee hierarchy table contains the employees' hierarchy information, such as the employee and their manager, as well as the hierarchy version.

There are two relationships between the tables, the employee and employee hierarchy relationship, and the manager and employee hierarchy relationship.

## Tools

- prisma/client
- NestJS
- typescript
- Among others

## Information

You can find the DB schema created with Prisma inside the folder Prisma / **schema.prisma**

## Previous steps

    1. The database is deployed on Render.com
    2. Set your .env file with the environments variables that you'll find in the .env.example file

## Run

    1. Clone the Repo:
    Git clone https://github.com/sebastiansandoval27/employees-back

    2. Install dependencies
    Yarn install

    3. Run the project
     - Yarn start:dev
    or
     - yarn dev
