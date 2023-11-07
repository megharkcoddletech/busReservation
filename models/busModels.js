const busdb = require('../db_connection');
const viewBus = (callback) =>{
    getBus = `select * from bus`;
    busdb.con.query(getBus,(err,result) =>{
        if (err) {
            callback({error:"error"}, null);
        }else{
            callback(null, result);
        }
    });
}


module.exports = {
    viewBus
}