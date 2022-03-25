const showGoods = require('./showGoods')
const buyGoods = require('./buyGoods')
const myGoods = require('./myGoods')
const useGoods = require('./useGoods')

/**
 * @function 商城功能
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = (req, res, next) => {

    const { rawMsg } = req

    if (rawMsg == '商店' || rawMsg == 'shop') {
        return showGoods(req, res)
    } else if (rawMsg.indexOf('购买道具') == 0) {
        return buyGoods(req, res)
    } else if (rawMsg == '我的道具') {
        return myGoods(req, res)
    } else if (rawMsg.indexOf('使用道具') == 0) {
        return useGoods(req, res)
    }

    next()
}