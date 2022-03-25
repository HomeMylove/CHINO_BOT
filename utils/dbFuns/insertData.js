const { db } = require('../../db/createDB')

/**
 * @function 插入一条数据
 * @param {String} tableName 表名
 * @param {Object} values 数据 
 * @returns <promise>
 */
module.exports = (tableName, values) => {
    const sqlStr = `INSERT INTO ${tableName} SET ?`
    return new Promise((resove, reject) => {
        db.query(sqlStr, [values], (err, results) => {
            if (err) reject(err)
            resove(results)
        })
    })
}