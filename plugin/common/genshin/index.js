const wish = require('./wish')

/**
 * @function 原神祈愿
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = (req, res, next) => {

    const { rawMsg } = req

    if (rawMsg == '抽卡' || rawMsg == '十连') {
        return wish(req, res)
    }
    next()
}

module.exports.__help = [
    ['祈愿', '抽卡\n十连'],
]