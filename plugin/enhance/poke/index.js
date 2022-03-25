const config = require('../../../config')

const NOTICE_GROUP = {}

// 最大戳数
const NOTICE_TIME = 4

/**
 * @function 对戳一戳作出反应
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = (req, res, next) => {
    const { rawMsg, groupId, noticeType, targetId, senderId } = req

    if (noticeType == 'notify' && targetId == config.selfId) {

        if (senderId == config.SUPERUSER) {
            return res.sendMsg({
                groupId,
                msg: '嘻嘻,主人'
            })
        }

        if (NOTICE_GROUP[groupId]) {
            NOTICE_GROUP[groupId]++
        } else {
            NOTICE_GROUP[groupId] = 1
        }

        if (NOTICE_GROUP[groupId] == NOTICE_TIME) {
            res.sendMsg({
                groupId,
                msg: `[CQ:at,qq=${config.SUPERUSER}]主人...他们欺负我!!!`
            })
            NOTICE_GROUP[groupId] = 0
            return
        }

        return res.sendMsg({
            groupId,
            msg: '不要戳啦！再戳...再戳我要告诉主人啦!!!'
        })
    } else if (rawMsg) {
        next()
    }
}