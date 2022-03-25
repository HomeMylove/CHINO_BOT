const { db } = require('../../../db/createDB')


/**
 * @function 返回闭嘴的数组
 * @returns 
 */
module.exports = () => {
    const sqlStr = 'SELECT * FROM control WHERE sleep=?'
    return new Promise((resove, reject) => {
        db.query(sqlStr, [1], (err, results) => {
            if (err) {
                reject(err)
            }

            const sleepList = []

            results.forEach(element => {
                if (element['sleep'] == 1) {
                    sleepList.push(element['group_id'])
                }
            })
            resove(sleepList)
        })

    })
}