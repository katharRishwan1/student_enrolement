const db = {};

db.user = require('./user');
db.course = require('./course');
db.student = require('./student');
module.exports = db;