const router = require('express').Router();
const cassandra = require('cassandra-driver')
var client = new cassandra.Client({ contactPoints: ['127.0.0.1'] , localDataCenter: 'dc1'})
 
client.connect((err, result) => {
if(err){
    console.log(err)
}else {
    console.log('Cassandra connected')

}
})

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
router.route('/addUser').post((req, res) => {
    const  insertQuery = "INSERT INTO people.student (id, name,father) VALUES(now(),?,?)";
const params = [req.body.name,req.body.father];
    client.execute(insertQuery, params,  { prepare: true})
        console.log("Inserted")
        res.json({status: 'success', message: 'data inserted'})
    

})
router.route('/removeUser').delete((req, res) => {
    const deleteQuery = "DELETE FROM people.student WHERE id = ?"
    const params = [req.body.id]
    client.execute(deleteQuery, params,  { prepare: true}).then((res) => {
        res.json({status: 'success', message: 'user deleted'})
    }).catch((err) => {
        res.json({status: 'err', message: err})

    })
})
module.exports = router;



 