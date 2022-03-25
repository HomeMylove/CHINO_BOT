const { db } = require('../../../db/createDB')

const logger = require('../../../log')

/**
 * @function 判断数据库中是否有echo
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports = (req, res) => {

    const { groupId, userId, rawMsg } = req

    const sqlStr = 'SELECT * FROM echo WHERE group_id=? AND question=?'

    return new Promise((resove, reject) => {
        db.query(sqlStr, [groupId, rawMsg], (err, results) => {
            if (err) {
                return resove(false)
            }
            if (results.length > 0) {
                const reg = /[爹爷入爽日爸狗猪]/g
                    // 优先回复本人
                for (let i = 0; i < results.length; i++) {
                    let item = results[i]
                    if (item['user_id'] == userId) {
                        res.sendMsg({
                            groupId,
                            msg: item['answer'].replace(reg, '*')
                        })
                        return resove(true)
                    }
                }
                // 随机回复
                res.sendMsg({
                    groupId,
                    msg: res.getRandomReply(results)['answer'].replace(reg, '*')
                })
                resove(true)

            }
            resove(false)
        })
    })
}