const { db } = require('../../../db/createDB')

/**
 * @function 展示我的道具
 * @param {*} req 
 * @param {*} res 
 */
module.exports = (req, res) => {

    const { groupId, userId } = req

    const sqlStr = 'SELECT * FROM qq_robot WHERE group_id=? AND user_id=?'

    db.query(sqlStr, [groupId, userId], (err, results) => {
        if (err) {
            return res.sendMsg({
                groupId,
                msg: '查询道具信息错误'
            })
        }

        if (results.length == 1) {

            let data = JSON.parse(results[0]['data_json'])

            if (!data) {
                return res.sendMsg({
                    groupId,
                    msg: '客人您还没有任何金币哦,金币可通过"签到"获得'
                })
            }

            let { goods } = data

            goods = goods || { g1: { status: false, num: 0 }, g2: { status: false, num: 0 }, g3: { status: false, num: 0 }, g4: { status: false } } // 我的商品

            const words = []

            words.push(`[CQ:at,qq=${userId}] 你的道具如下:`)

            words.push(`1.意式浓缩(补签卡)\t数量 ${goods['g1']['num']}`)
            words.push(`2.拿铁咖啡(双倍卡)\t数量 ${goods['g2']['num']}`)
            words.push(`3.摩卡咖啡(改运卡)\t数量 ${goods['g3']['num']}`)

            words.push(`使用道具请回复: \n使用道具 1 | 使用道具 意式浓缩`)

            return res.sendMsg({
                groupId,
                msg: words.join('\n')
            })

        } else {
            return res.sendMsg({
                groupId,
                msg: '未查询到你的信息'
            })
        }
    })
}