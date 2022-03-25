const { SUPERUSER } = require('../../../config')
const { db } = require('../../../db/createDB')

/**
 * @function 删除一句echo
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports = (req, res) => {

    const { rawMsg, groupId, userId } = req

    const reg = /id=(\d+)/

    let id

    try {
        id = rawMsg.match(reg)[1]
    } catch {
        return res.sendMsg({
            groupId,
            msg: '格式错误 正确格式\nupdete id=123'
        })
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

            const question = results[0]['question']

            const sqlStr = 'DELETE FROM echo WHERE id=?'

            db.query(sqlStr, [id], (err, results) => {
                if (err) {
                    return res.sendMsg({
                        groupId,
                        msg: '删除失败'
                    })
                }
                if (results.affectedRows == 1) {
                    return res.sendMsg({
                        groupId,
                        msg: `成功删除,智乃以后不会回应你的 ${question}`
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