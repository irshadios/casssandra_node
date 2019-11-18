# casssandra_node
### Install cassandra
    http://www.apache.org/dyn/closer.lua/cassandra/3.11.5/apache-cassandra-3.11.5-bin.tar.gz
 ### install some packages
    npm install cassandra-driver
  
 ## main.js
    var express = require('express');
    const cors = require('cors');
    const port  = process.env.PORT || 5000;
    var app = express()
    app.use(cors())
    app.use(express.json())
    const usersRouter = require('./routes/users')

    app.use('/users', usersRouter);
    app.listen(port, () => console.log('server started on port '+port));
    
## users.js

    const router = require('express').Router();
    const cassandra = require('cassandra-driver')
### connect to cassandra
    var client = new cassandra.Client({ contactPoints: ['127.0.0.1'] , localDataCenter: 'dc1'})
 
    client.connect((err, result) => {
    if(err){
      console.log(err)
    }else {
      console.log('Cassandra connected')

      }
    })
### select query to users route 
    var getAllSubscribers = 'select * from people.student ';

    router.route('/').get((req, res) => {
    
      client.execute(getAllSubscribers , [], (err, result) => {
          console.log(err);
          if (err) {
              res.send({err})
            } else {
              console.log(result.rows)
              res.json({ subscribes: result.rows})
            }
        });
    });
### inserting data to database 
      router.route('/addUser').post((req, res) => {
          const  insertQuery = "INSERT INTO people.student (id, name,father) VALUES(now(),?,?)";
      const params = [req.body.name,req.body.father];
          client.execute(insertQuery, params,  { prepare: true})
              console.log("Inserted")
              res.json({status: 'success', message: 'data inserted'})


      })
### deleting data from database
      router.route('/removeUser').delete((req, res) => {
          const deleteQuery = "DELETE FROM people.student WHERE id = ?"
          const params = [req.body.id]
          client.execute(deleteQuery, params,  { prepare: true}).then((res) => {
              res.json({status: 'success', message: 'user deleted'})
          }).catch((err) => {
              res.json({status: 'err', message: err})

          })
      })
### finally we have to export to router
      module.exports = router;



 
