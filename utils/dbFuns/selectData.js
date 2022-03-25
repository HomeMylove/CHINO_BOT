const { db } = require('../../db/createDB')

/**
 * @function 查找数据 
 * @param {String} tableName 表名
 * @param {object} userObj 查询的用户的对象,至少应该给出user_id和group_id
 * @param {int} userObj.user_id 查询用户的id
 * @param {int} userObj.group_id 查询用户的群id
 * @returns <promise> 返回一个
 */
module.exports = (tableName, userObj) => {
    const { user_id, group_id } = userObj
    return new Promise((resove, reject) => {
        const sqlStr = `SELECT * FROM ${tableName} WHERE user_id=? AND group_id=?`
        db.query(sqlStr, [user_id, group_id], (err, results) => {
            if (err) reject(err)

            resove(results)

        })
    })
}