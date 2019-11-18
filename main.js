var express = require('express');
const cors = require('cors');
const port  = process.env.PORT || 5000;

const cassandra = require('cassandra-driver');

var app = express()

app.use(cors())
app.use(express.json())

//const exercisesRouter = require('./routes/exercises')
const usersRouter = require('./routes/users')

//app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);




app.listen(port, () => console.log('server started on port '+port));
