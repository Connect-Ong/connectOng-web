const knex = require('knex');
const configuration = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development'

const environmentConfig = configuration[environment]
const connection = knex(environmentConfig);

console.log("using environment...",environment)
console.log("using environment...",environmentConfig.connection.filename)

module.exports = connection;
