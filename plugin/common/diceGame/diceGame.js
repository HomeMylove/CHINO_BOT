// 导入配置
const config = require('../../../config')

const { db } = require('../../../db/createDB')

const { getGroupMemberInfo } = require('../../../api/requests')

// 是否作弊
let CHEATING = true

// 作弊则注释掉下一行
CHEATING = false

const CHEATING_POINT = 999

/**
 * @function 骰子对决,群成员与 robot 进行对决
 * @param {object} req
 */
module.exports = async(req, res) => {

    const { rawMsg, groupId, userId, sender, selfId } = req

    const nickname = sender['card'] || sender['nickname'] // 对方的昵称

    // 是否有艾特
    const reg = /\[CQ:at,qq=([0-9]+)\]/

    // 是否有多的词
    const str = rawMsg.replace(reg, '').replace('掷骰子', '').trim()

    // 是否有@
    const result = rawMsg.match(reg)
    let player

    if (result !== null) player = result[1]

    let winner, loser, drawer1, drawer2

    // 有多的词
    if (str) {
        let msg = `[CQ:at,qq=${userId}]\n格式不对哦!\n可回复“帮助 掷骰子”`
        return res.sendMsg({
            groupId,
            msg
        })

        // 格式正确,挑战智乃
    } else if (rawMsg === '掷骰子' || player == selfId) {
        // 产生随机点数
        let number1 = Math.ceil(Math.random() * 6)
        let number2 = Math.ceil(Math.random() * 6)

        if (CHEATING) {
            if (userId == config.SUPERUSER) {
                let msg = `[CQ:at,qq=${userId}]\n主人掷出了${CHEATING_POINT}\n${config.robotName}掷出了${number1}\n主人获得了胜利 [CQ:face,id=21]`
                return res.sendMsg({ groupId, msg })
            }
        }

        // 判断结果
        let result = null

        if (number1 > number2) {
            result = `${config.robotName}获得了胜利 [CQ:face,id=13]`

            winner = {
                id: selfId,
                name: config.robotName
            }

            loser = {
                id: userId,
                name: nickname
            }


        } else if (number1 < number2) {
            result = `${nickname}获得了胜利 [CQ:face,id=18]`

            winner = {
                id: userId,
                name: nickname
            }

            loser = {
                id: selfId,
                name: config.robotName
            }

        } else {
            result = '平局 [CQ:face,id=98]'

            drawer1 = {
                id: userId,
                name: nickname
            }
            drawer2 = {
                id: selfId,
                name: config.robotName
            }
        }
        // 生成 msg @ID result
        let msg = `[CQ:at,qq=${userId}]\n你掷出了${number2}\n${config.robotName}掷出了${number1}\n` + result

        res.sendMsg({ groupId, msg })

        if (winner && loser) {
            try {
                await winOrLose(groupId, { winner })
                await winOrLose(groupId, { loser })
            } catch (error) {
                console.log(error);
            }
        } else if (drawer1 && drawer2) {
            try {
                await winOrLose(groupId, { drawer: drawer1 })
                await winOrLose(groupId, { drawer: drawer2 })
            } catch (error) {
                console.log(error)
            }
        }

    } else {
        let response
        try {
            response = await getGroupMemberInfo(groupId, parseInt(player))
        } catch (error) {
            return res.sendMsg({
                groupId,
                msg: "失败"
            })
        }

        const nickname2 = response['card'] || response['nickname']
            // 产生随机点数
        const number1 = Math.ceil(Math.random() * 6)
        const number2 = Math.ceil(Math.random() * 6)

        if (CHEATING) {
            if (player == config.SUPERUSER) {
                let msg = `[CQ:at,qq=${userId}]\n你掷出了${number1}\n我的主人掷出了${myPoint}\n主人获得了胜利 [CQ:face,id=99]`
                return res.sendMsg({ groupId, msg })
            }

            if (userId == config.SUPERUSER) {
                let msg = `[CQ:at,qq=${userId}]\n主人你掷出了${myPoint}\n[CQ:at,qq=${player}]你掷出了${number1}\n主人获得了胜利 [CQ:face,id=99]`
                return res.sendMsg({ groupId, msg })
            }
        }

        // 判断结果
        let result = null
        if (number1 > number2) {
            result = `${nickname}获得了胜利`

            winner = {
                id: userId,
                name: nickname
            }

            loser = {
                id: player,
                name: nickname2
            }

        } else if (number1 < number2) {
            result = `${nickname2}获得了胜利`

            winner = {
                id: player,
                name: nickname2
            }

            loser = {
                id: userId,
                name: nickname
            }
        } else {
            result = '平局'

            drawer1 = {
                id: userId,
                name: nickname
            }
            drawer2 = {
                id: player,
                name: nickname2
            }
        }
        // 生成 msg @ID result
        let msg = `[CQ:at,qq=${userId}] 你掷出了${number1}\n[CQ:at,qq=${player}]你掷出了${number2}\n` + result

        res.sendMsg({ groupId, msg })

        if (winner && loser) {
            try {
                await winOrLose(groupId, { winner })
                await winOrLose(groupId, { loser })
            } catch (error) {
                console.log(error);
            }
        } else if (drawer1 && drawer2) {
            try {
                await winOrLose(groupId, { drawer: drawer1 })
                await winOrLose(groupId, { drawer: drawer2 })
            } catch (error) {
                console.log(error)
            }
        }
    }
}


/**
 * @function 存储对局记录
 * @param {*} param0 
 * @returns 
 */
function winOrLose(groupId, { winner, loser, drawer }) {

    let player = winner || loser || drawer

    const sqlStr = 'SELECT * FROM qq_robot WHERE group_id=? AND user_id=?'

    return new Promise((resove, reject) => {

        db.query(sqlStr, [groupId, player.id], (err, results) => {
            if (err) {
                return res.sendMsg({
                    groupId,
                    msg: '写入对局失败'
                })
            }

            if (results.length == 1) {

                let rawData
                if (!results[0]['win_rate']) {
                    rawData = {
                        win: 0,
                        lose: 0,
                        draw: 0,
                        rate: 0,
                        name: player.name
                    }
                } else {
                    rawData = JSON.parse(results[0]['win_rate'])
                }
                let { win, lose, rate, draw } = rawData
                if (winner) {
                    win += 1
                } else if (loser) {
                    lose += 1
                } else {
                    draw += 1
                }
                rate = win / (win + lose + draw)

                const win_rate = JSON.stringify({
                    win,
                    lose,
                    rate,
                    draw,
                    name: player.name
                })

                const user = {
                    win_rate
                }

                const sqlStr = 'UPDATE qq_robot SET ? WHERE group_id=? AND user_id=?'

                db.query(sqlStr, [user, groupId, player.id], (err, results) => {
                    if (err) {
                        return res.sendMsg({
                            groupId,
                            msg: '写入对局失败'
                        })
                    }

                    if (results.affectedRows == 1) {
                        console.log('写入对局成功');
                        resove('ok')
                    }
                })

            } else if (results.length == 0) {

                const sqlStr = 'INSERT INTO qq_robot SET ?'

                let data = {
                    win: 0,
                    lose: 0,
                    rate: 0,
                    draw: 0,
                    name: player.name
                }

                if (winner) {
                    data['win'] += 1
                } else if (loser) {
                    data['lose'] += 1
                } else {
                    data['draw'] += 1
                }

                const win_rate = JSON.stringify(data)


                const user = {
                    group_id: groupId,
                    user_id: player.id,
                    win_rate
                }

                db.query(sqlStr, [user], (err, results) => {
                    if (err) {
                        return res.sendMsg({
                            groupId,
                            msg: '写入对局失败'
                        })
                    }

                    if (results.affectedRows == 1) {
                        console.log('写入对局成功');

                        resove('ok')
                    }
                })


            }
        })

    })

}