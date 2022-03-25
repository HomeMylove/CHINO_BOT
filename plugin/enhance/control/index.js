const config = require('../../../config')
const sleep = require('./sleep')
const judge = require('./judge')

// 闭嘴群组
let sleepList = []

// 是否初次加载
let flag = true

/**
 * @function 控制智乃闭嘴与说话
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = async(req, res, next) => {

    const { groupId, userId, rawMsg } = req

    if (flag) {
        try {
            sleepList = await judge()
            flag = false
        } catch (error) {
            console.log(error, 'control');
        }
    }

    if (userId == config.SUPERUSER) {
        if (rawMsg == `${config.robotName}闭嘴` || rawMsg == `${config.robotName}说话`) {
            try {
                await sleep(req, res)
                sleepList = await judge()
                return
            } catch (error) {
                console.log(error, 'control');
            }
        }
    }

    if (sleepList.indexOf(groupId.toString()) !== -1) {
        return
    }
    next()
}