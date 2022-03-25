const { db } = require('../../../db/createDB')

/**
 * @function 使用道具
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports = (req, res) => {

    const { groupId, userId, rawMsg } = req

    const goodsNum = rawMsg.replace('使用道具', '').trim()

    let index

    switch (goodsNum) {
        case '意式浓缩':
        case '1':
        case '一':
        case 'one':
            index = 1
            break;
        case '拿铁咖啡':
        case '2':
        case '二':
        case 'two':
            index = 2
            break;
        case '摩卡咖啡':
        case '3':
        case '三':
        case 'three':
            index = 3
            break;
        case '卡布奇诺':
        case '4':
        case '四':
        case 'four':
            index = 4
            break;
        default:
            index = 0
            break;
    }

    if (index) {
        if (index == 4) {
            return res.sendMsg({
                groupId,
                msg: '你知道吗?卡布奇诺,就是智乃名字的由来哦!'
            })
        }
        const sqlStr = 'SELECT * FROM qq_robot WHERE group_id=? AND user_id=?'

        db.query(sqlStr, [groupId, userId], (err, results) => {
            if (err) {
                return res.sendMsg({
                    groupId,
                    msg: '读取道具错误'
                })
            }

            if (results.length == 1) {

                let data = JSON.parse(results[0]['data_json'])

                if (!data) {
                    return res.sendMsg({
                        groupId,
                        msg: '客人您没有任何道具,请先好好签到吧'
                    })
                }

                let { goods } = data

                goods = goods || { g1: { status: false, num: 0 }, g2: { status: false, num: 0 }, g3: { status: false, num: 0 }, g4: { status: false } } // 我的商品

                let { g1, g2, g3 } = goods

                if (index == 1) {

                    if (g1['num'] > 0) {
                        // 使用补签卡
                        if (data['notCheckInDays'] == 0) {
                            return res.sendMsg({
                                groupId,
                                msg: '您一直有好好签到,不需要使用补签卡哦'
                            })
                        } else if (data['notCheckInDays'] == 1) { // 可以使用
                            // restoreData(data)
                            if (data['checkInStatus']) {
                                data['checkInRecords'] += 2

                            } else {
                                data['checkInRecords'] += 1
                            }

                            data['checkInDays'] = data['checkInRecords']
                            data['notCheckInDays'] = 0

                            g1['num'] -= 1

                        } else {
                            return res.sendMsg({
                                groupId,
                                msg: '只能补签昨天一天哦,下次早点使用吧'
                            })
                        }

                    } else {
                        return res.sendMsg({
                            groupId,
                            msg: `对不起,您没有任何道具${goodsNum}`
                        })
                    }
                } else if (index == 2) {
                    if (g2['num'] > 0) {
                        // 使用双倍卡
                        if (data['double']) {
                            return res.sendMsg({
                                groupId,
                                msg: '你已经使用过双倍道具啦'
                            })
                        } else {
                            // 使用成功
                            data['double'] = true
                            g2['num'] -= 1
                        }
                    } else {
                        return res.sendMsg({
                            groupId,
                            msg: `对不起,您没有任何道具${goodsNum}`
                        })
                    }
                } else if (index == 3) {
                    if (g3['num'] > 0) {
                        // 使用双倍卡
                        if (data['fortune'] == '9' || data['fortune'] == '10') {
                            return res.sendMsg({
                                groupId,
                                msg: '你今天的运势是大吉哦!!!不需要使用改运卡啦'
                            })
                        } else {
                            // 使用成功
                            const newFortune = Math.ceil(Math.random() * 10)
                            const oldFortune = data['fortune']

                            data['fortune'] = newFortune

                            let msg

                            if (newFortune > oldFortune) {
                                msg = `你今日的运势由${getFortune(oldFortune)}变为了${getFortune(newFortune)},好耶!!!`
                            } else if (newFortune < oldFortune) {
                                msg = `你今日的运势由${getFortune(oldFortune)}变为了${getFortune(newFortune)},坏了。。。`
                            } else {
                                msg = '太遗憾了,你今日的运势没有任何变化,但是金币不能退哦'
                            }

                            g3['num'] -= 1

                            res.sendMsg({
                                groupId,
                                msg
                            })
                        }
                    } else {
                        return res.sendMsg({
                            groupId,
                            msg: `对不起,您没有任何道具${goodsNum}`
                        })
                    }
                }

                data = {...data, goods }

                const newData = {
                    data_json: JSON.stringify(data)
                }

                const sqlStr = 'UPDATE qq_robot SET ? WHERE group_id=? AND user_id=?'

                db.query(sqlStr, [newData, groupId, userId], (err, results) => {
                    if (err) {
                        return console.log(err);
                    }
                    if (results.affectedRows == 1) {
                        return res.sendMsg({
                            groupId,
                            msg: `[CQ:at,qq=${userId}]\n使用道具${goodsNum}成功`
                        })
                    }

                })

            } else {
                return res.sendMsg({
                    groupId,
                    msg: '未查询到你的信息'
                })
            }
        })
    } else {
        return res.sendMsg({
            groupId,
            msg: '本店尚未出售该商品'
        })
    }
}


function getFortune(num) {
    let luck
        // 计算运势
    switch (num) {
        case 1:
        case 2:
            luck = '大凶';
            break;
        case 3:
        case 4:
            luck = '小凶';
            break;
        case 5:
        case 6:
            luck = '小吉';
            break;
        case 7:
        case 8:
            luck = '中吉';
            break;
        case 9:
        case 10:
            luck = '大吉';
            break;
    }
    return num + `(${luck})`
}