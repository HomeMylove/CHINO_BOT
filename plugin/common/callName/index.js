const remindMyName = require('./remindMyName')
const rememberMyName = require('./rememberMyName')
const { robotName } = require('../../../config')


/**
 * @function 让智乃记住一个名字
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = (req, res, next) => {
    let { rawMsg } = req

    let nick = res.getNickName(rawMsg)

    if (nick) {
        rawMsg = rawMsg.replace(nick, '').trim()

        if (rawMsg.indexOf(`以后叫我`) === 0) {

            req['rawMsg'] = rawMsg
            return rememberMyName(req, res)

        } else if (rawMsg === `我是谁` || rawMsg === `你是我的谁` || rawMsg === '我是你的谁') {

            req['rawMsg'] = rawMsg
            return remindMyName(req, res)

        }

    }

    if (rawMsg == '记住我') {
        return res.sendMsg({
            groupId,
            msg: '功能名虽然叫"记住我",但是可不是这么用的哦\n请使用"帮助 记住我"了解使用方法吧~'
        })
    }




    next()

}


module.exports.__help = [
    ['记住我', `${robotName}以后叫我欧尼酱\n${robotName}我是谁 | ${robotName}你是我的谁 | ${robotName}我是你的谁`]
]