require('dotenv').config();

const { sequelize, Teacher, Course } = require('./models');

async function seed() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        const count = await Teacher.count();

        if (count > 0) {
            console.log('В базе уже есть данные');
            await sequelize.close();
            return;
        }

        const ivan = await Teacher.create({
            name: 'Ivan Ivanov',
            email: 'ivanov@example.com',
            department: 'Informatics',
            academicDegree: 'Doctor'
        });

        const maria = await Teacher.create({
            name: 'Maria Ionescu',
            email: 'ionescu@example.com',
            department: 'Informatics',
            academicDegree: 'Professor'
        });

        const andrei = await Teacher.create({
            name: 'Andrei Rusu',
            email: 'rusu@example.com',
            department: 'Mathematics',
            academicDegree: 'Master'
        });

        await Course.create({
            title: 'Server-side Programming',
            credits: 5,
            semester: 1,
            description: 'Development of server-side applications using Node.js',
            teacherId: ivan.id
        });

        await Course.create({
            title: 'Node.js Frameworks',
            credits: 5,
            semester: 3,
            description: 'Express.js, routing, middleware and template engines',
            teacherId: ivan.id
        });

        await Course.create({
            title: 'Databases',
            credits: 6,
            semester: 2,
            description: 'Relational databases, SQL and database design',
            teacherId: maria.id
        });

        await Course.create({
            title: 'Web Programming',
            credits: 4,
            semester: 1,
            description: 'HTML, CSS and JavaScript for building web pages',
            teacherId: maria.id
        });

        await Course.create({
            title: 'Algorithms and Data Structures',
            credits: 6,
            semester: 2,
            description: 'Sorting, searching, lists, trees and graphs',
            teacherId: andrei.id
        });

        console.log('Данные добавлены');
        await sequelize.close();
    } catch (error) {
        console.log('Ошибка: ' + error.message);
    }
}

seed();
