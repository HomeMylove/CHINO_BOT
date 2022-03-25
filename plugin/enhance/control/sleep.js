const { db } = require('../../../db/createDB')
const config = require('../../../config')

/**
 * @function 让智乃睡觉或者唤醒智乃
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports = (req, res) => {

    const { groupId, rawMsg } = req

    const sqlStr = 'SELECT * FROM control WHERE group_id=?'

    const code = rawMsg == `${config.robotName}闭嘴` ? 1 : 0

    return new Promise((resove, reject) => {
        db.query(sqlStr, [groupId], (err, results) => {
            if (err) {
                reject(err)
            }
            if (results.length > 0) {
                if (results[0]['sleep'] == code) {
                    reject()
                }

                const sqlStr = 'UPDATE control SET sleep=? WHERE group_id=?'

                db.query(sqlStr, [code, groupId], (err, results) => {
                    if (err) {
                        reject(err)
                    }
                    if (results.affectedRows === 1) {
                        res.sendMsg({
                            groupId,
                            msg: code ? '智乃闭嘴啦' : '智乃复活啦'
                        })
                        resove()
                    }
                })
            } else {
                if (code == 0) {
                    return
                }
                const sqlStr = 'INSERT INTO control SET ?'
                const data = {
                    group_id: groupId,
                    sleep: code
                }
                db.query(sqlStr, [data], (err, results) => {
                    if (err) {
                        reject(err)
                    }
                    if (results.affectedRows === 1) {
                        res.sendMsg({
                            groupId,
                            msg: code ? '智乃闭嘴啦' : '智乃复活啦'
                        })
                        resove()
                    }
                })
            }

        })
    })



}