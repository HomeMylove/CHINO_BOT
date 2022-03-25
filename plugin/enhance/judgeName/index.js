const pinyin = require('pinyin')

const TWICE_GROUP = {} // 两次叫错名字
const WRONG_GROUP = {} // 小乃子的后果

/**
 * @function 判断称呼是否正确
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = (req, res, next) => {

    const { rawMsg, groupId } = req

    // 得到首两个字
    const f2words = rawMsg.substring(0, 2) || ''

    // 得到首两个字的拼音
    const f2pinyin = pinyin(f2words, { style: pinyin.STYLE_NORMAL }) || [
        [],
        []
    ]

    // flag 判断是否叫错
    // 默认叫对 false
    let flag = false

    if (f2pinyin[0][0] == 'zhi' && f2pinyin[1][0] == 'nai' && f2words != '智乃') {
        flag = true
        TWICE_GROUP[groupId] = f2words
    } else if (f2pinyin[0][0] == 'nai' && (f2pinyin[1][0] == 'zhi' || f2pinyin[1][0] == 'zi')) {
        flag = true
        TWICE_GROUP[groupId] = f2words
    }

    // 在叫错名字后回复 好的+name
    if (rawMsg.indexOf(`好的${TWICE_GROUP[groupId]}`) == 0) {
        res.sendMag({
            groupId,
            msg: `都说了我不叫${TWICE_GROUP[groupId]}了啦,你再这么叫我的话我就要生气了`
        })
        TWICE_GROUP[groupId] = null
        return
    }

    // 直接叫小乃子的情况
    if (rawMsg.indexOf('小乃子') == 0) {
        if (!WRONG_GROUP[groupId]) {
            WRONG_GROUP[groupId] = 1
        } else {
            WRONG_GROUP[groupId] += 1
        }
        if (WRONG_GROUP[groupId] < 3) {
            return res.sendMsg({
                groupId,
                imgUrl: 'mc/sajiao.jpg'
            })
        } else if (WRONG_GROUP[groupId] < 5) {
            return res.sendMsg({
                groupId,
                imgUrl: 'mc/cry.jpg'
            })
        } else {
            WRONG_GROUP[groupId] = 0
            return res.sendMsg({
                groupId,
                imgUrl: 'mc/kage.jpg'

            })
        }

        // 叫成了其他名字
    } else if (flag) {
        return res.sendMsg({
            groupId,
            msg: `我叫智乃,不叫${f2words}!!!`,
            imgUrl: 'mc/sajiao.jpg'
        })
    }

    next()
}