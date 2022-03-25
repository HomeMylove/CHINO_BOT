const { db } = require('../../../db/createDB')

/**
 * @function 显示胜率排行榜
 * @param {*} req 
 * @param {*} res 
 */
module.exports = (req, res) => {

    const { groupId, userId, rawMsg } = req

    const sqlStr = 'SELECT * FROM qq_robot WHERE group_id=?'

    db.query(sqlStr, [groupId], (err, results) => {
        if (err) {
            return res.sendMsg({
                groupId,
                msg: '查询错误'
            })
        }

        // 剔除没有数据的
        const rank = []

        for (let i = 0; i < results.length; i++) {
            if (results[i]['win_rate']) {
                const u = JSON.parse(results[i]['win_rate'])
                u['user_id'] = results[i]['user_id']
                rank.push(u)
            }
        }

        // 排序
        const newRank = rank.sort((a, b) => b['rate'] - a['rate'])

        if (rawMsg == '我的胜率') {
            for (let i = 0; i < newRank.length; i++) {

                const item = newRank[i]

                if (item['user_id'] == userId) {

                    const { win, lose, rate, draw } = item

                    const words = []

                    words.push(`[CQ:at,qq=${userId}]`)

                    words.push(`胜利 ` + win)
                    words.push(`失败 ` + lose)
                    words.push(`平局 ` + draw)
                    words.push(`总胜率 ` + Math.round(rate * 100) + '%')
                    words.push(`本群排行第${i+1}名`)

                    return res.sendMsg({
                        groupId,
                        msg: words.join('\n')
                    })
                }
            }
            return res.sendMsg({
                groupId,
                msg: `[CQ:at,qq=${userId}]\n没有查询到你的对战记录`
            })
        } else {
            let num = rawMsg.replace('排行榜').trim()
            num = num ? num * 1 : 10

            if (isNaN(num)) {
                return
            }

            const max = newRank.length >= num ? num : newRank.length

            const words = []
            words.push("本群胜率排行榜")
            words.push("名次\t胜率\t昵称")

            for (let i = 0; i < max; i++) {

                let { win, lose, rate, draw, name } = newRank[i]

                rate = Math.round(rate * 100) + '%'
                name = name ? name : '未取得昵称'
                words.push(`${i+1}\t${rate}\t${name}`)
            }
            return res.sendMsg({
                groupId,
                msg: words.join('\n')
            })


        }

    })

}