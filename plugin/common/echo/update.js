const { db } = require('../../../db/createDB')
const { SUPERUSER } = require('../../../config')


/**
 * @function 更新一句echo
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports = (req, res) => {

    const { rawMsg, groupId, userId } = req

    const reg1 = /id=(\d+)/
    const reg2 = /\s+(.*?)\s+/

    let id, question, answer

    try {
        let results = rawMsg.match(reg1)

        id = results[1]

        question = rawMsg.replace(results[0], '').match(reg2)[1]

        answer = rawMsg.replace('update', '').replace(results[0], '').replace(question, '').trim()

    } catch {
        return res.sendMsg({
            groupId,
            msg: '格式错误'
        })
    }

    const user = {
        question,
        answer
    }

    let sqlStr, params

    if (userId == SUPERUSER) {
        sqlStr = 'SELECT * FROM echo WHERE group_id=? AND id=?'
        params = [groupId, id]
    } else {
        sqlStr = 'SELECT * FROM echo WHERE user_id=? AND group_id=? AND id=?'
        params = [userId, groupId, id]
    }

    db.query(sqlStr, params, (err, results) => {
        if (err) {
            return res.sendMsg({
                groupId,
                msg: '查找失败'
            })
        }
        if (results.length == 1) {
            const sqlStr = 'UPDATE echo SET ? WHERE id = ?'

            db.query(sqlStr, [user, id], (err, results) => {
                if (err) {
                    return res.sendMsg({
                        groupId,
                        msg: '替换旧问答失败'
                    })
                }
                if (results.affectedRows == 1) {
                    return res.sendMsg({
                        groupId,
                        msg: `智乃记住了,以后你可以对我说"${question}"`
                    })
                }
            })
        } else {
            return res.sendMsg({
                groupId,
                msg: '这句话不属于你,请使用 show 确认id'
            })
        }
    })

}