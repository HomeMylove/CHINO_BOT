const { db } = require('../../../db/createDB')

const sqlStr = 'UPDATE qq_robot SET ?'

const data = {
    win_rate: JSON.stringify()
}

db.query(sqlStr, [data], (err, results) => {
    if (err) {
        return console.log(err);
    }


    return console.log('归零');
})