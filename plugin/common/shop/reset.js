const { db } = require('../../../db/createDB')




// const sqlStr = "UPDATE qq_robot SET data_json=JSON_SET(data_json,'$.coins',1000)"
// const sqlStr = "UPDATE qq_robot SET data_json=JSON_REMOVE(data_json,'$.goods','$.master')"
const sqlStr = "UPDATE qq_robot SET data_json=JSON_SET(data_json, '$.coins',(json_extract(data_json, '$.coins') + 100))"

db.query(sqlStr, [], (err, results) => {
    if (err) {
        console.log(err);
    } else {
        console.log('ok');
    }
})