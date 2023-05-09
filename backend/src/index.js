const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3333;

app.use(cors({
    // origin: 'http://meuapphospedado.com' // root url
}));

app.use(express.json());
app.use(routes);
app.use(errors());


app.listen(port);
console.log("Server running on port",port);
