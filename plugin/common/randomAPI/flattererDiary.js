const { getTGDiary } = require('../../../api/requests')

/**
 * @function 舔狗日记
 * @param {object} body 
 * @param {object} res 使用res上的方法
 */
module.exports = async(req, res) => {

    const { groupId, rawMsg } = req

    const reg = /舔(.*?)日记/

    const keyword = rawMsg.match(reg)[1]

    let result

    try {
        result = await getTGDiary()

        let msg
        if (keyword == '狗' || keyword == '') {
            msg = result['data']
        } else {
            msg = result['data'].replace(/你/g, keyword)
        }

        return res.sendMsg({
            groupId,
            msg
        })
    } catch (error) {
        res.sendMsg({
            groupId,
            msg: '好像出了点儿问题'
        })
        return console.error(error);
    }
}