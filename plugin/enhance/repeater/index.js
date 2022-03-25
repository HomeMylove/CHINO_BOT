// 复读机
const MESSAGE = {}

// 开始复读的次数
const REPEAT_TIME = 2

// 打断施法的次数
const PAUSE_TIME = 4

// 不打断的群聊
const DONT_PAUSE = ['797991867']

// 报数的次数
const COUNT_TIME = 3


/**
 * @function 复读机
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = (req, res, next) => {

    const { rawMsg, groupId } = req

    // 在消息列表中添加群组
    if (!MESSAGE[groupId]) {
        // 以群组的id作为对象的 键
        // rawMsg 原消息
        // num 消息出现的次数
        // 上一次重复的消息 (避免在复读一次之后继续复读)
        MESSAGE[groupId] = { rawMsg, num: 1 }

        // 消息列表中存在群组的情况下
    } else {
        // 复读
        if (MESSAGE[groupId]['rawMsg'] == rawMsg) {

            MESSAGE[groupId]['num']++;

            if (MESSAGE[groupId]['num'] == REPEAT_TIME) {

                return res.sendMsg({
                    msg: rawMsg,
                    groupId
                })
            } else if (MESSAGE[groupId]['num'] == PAUSE_TIME) {
                if (DONT_PAUSE.indexOf(groupId.toString()) !== -1) {
                    return next()
                }
                if (rawMsg == '打断施法!!!') {
                    return res.sendMsg({
                        groupId,
                        msg: '打断打断施法!!!'
                    })
                } else {
                    return res.sendMsg({
                        groupId,
                        msg: '打断施法!!!'
                    })
                }
            }

        }
        // 报数
        else if (MESSAGE[groupId]['rawMsg'] == rawMsg * 1 - 1) {
            if (MESSAGE[groupId]['num'] > COUNT_TIME) {
                return
            }
            MESSAGE[groupId]['num']++;

            res.sendMsg({
                msg: rawMsg * 1 + 1 || '0',
                groupId
            })

            MESSAGE[groupId]['rawMsg'] = rawMsg * 1 + 1
            return
        } else if (MESSAGE[groupId]['rawMsg'] == rawMsg * 1 + 1) {
            if (MESSAGE[groupId]['num'] > COUNT_TIME) {
                return
            }
            MESSAGE[groupId]['num']++;

            res.sendMsg({
                msg: rawMsg * 1 - 1 || '0',
                groupId
            })

            MESSAGE[groupId]['rawMsg'] = rawMsg * 1 - 1
            return
        } else {
            MESSAGE[groupId]['rawMsg'] = rawMsg
            MESSAGE[groupId]['num'] = 1
        }
    }
    next()
}