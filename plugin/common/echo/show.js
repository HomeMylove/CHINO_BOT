const { SUPERUSER } = require('../../../config')
const { db } = require('../../../db/createDB')

/**
 * @function 展示自己的echo
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports = (req, res) => {

    const { rawMsg, groupId, userId } = req

    if (rawMsg == 'show') {
        const sqlStr = 'SELECT * FROM echo WHERE user_id=? AND group_id=?'

        db.query(sqlStr, [userId, groupId], (err, results) => {
            if (err) {
                return res.sendMsg({
                    groupId,
                    msg: "查询信息错误"
                })
            }

            const msgList = []
            msgList.push(`[CQ:at,qq=${userId}] 智乃可以回复如下问题`)
            msgList.push(`id  Question`)

            for (let i = 0; i < results.length; i++) {
                const item = results[i]

                const { id, question, answer } = item

                const str = `${id}  ${question}`

                msgList.push(str)
            }

            return res.sendMsg({
                groupId,
                msg: msgList.join('\n')
            })
        })
    } else {
        if (userId != SUPERUSER) {
            return
        }
        const question = rawMsg.replace('show', '').trim()

        const sqlStr = 'SELECT * FROM echo WHERE group_id=? AND question=?'

        db.query(sqlStr, [groupId, question], (err, results) => {
            if (err) {
                return res.sendMsg({
                    groupId,
                    msg: "查询信息错误"
                })
            }

            const msgList = []
            msgList.push(`[CQ:at,qq=${userId}] 智乃查询到如下Question`)
            msgList.push(`id  Question Answer`)

            for (let i = 0; i < results.length; i++) {
                const item = results[i]

                const { id, question, answer } = item

                const str = `${id}  ${question}----${answer}`

                msgList.push(str)
            }
            return res.sendMsg({
                groupId,
                msg: msgList.join('\n')
            })
        })
    }
}