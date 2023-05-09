// Update with your config settings.
if (process.env.NODE_ENV === 'production') {
  const pg = require('pg');
  pg.defaults.ssl = {
        rejectUnauthorized: false,
  };
};

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'connectong',
      filename: 'postgres://localhost/connectong'
    },
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeds',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: { 
      rejectUnauthorized: false 
    },
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeds',
    },
  },
};
