const diceGame = require('./diceGame')
const showWinRate = require('./showWinRate')

/**
 * @function 掷骰子功能
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = (req, res, next) => {

    const { rawMsg } = req

    if (rawMsg.indexOf('掷骰子') !== -1) {

        return diceGame(req, res)

    } else if (rawMsg == '我的胜率' || rawMsg.indexOf('排行榜') == 0) {
        return showWinRate(req, res)
    }
    next()
}

module.exports.__help = [
    ['掷骰子', `掷骰子 | 掷骰子@×× | @×× 掷骰子\n我的胜率\n排行榜`]
]