const sequelize = require('../config/database');
const Teacher = require('./Teacher');
const Course = require('./Course');

Teacher.hasMany(Course, {
    foreignKey: 'teacherId'
});

Course.belongsTo(Teacher, {
    foreignKey: 'teacherId'
});

module.exports = { sequelize, Teacher, Course };
