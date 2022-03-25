const { signIn } = require('./signIn')


/**
 * @function 签到功能
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = (req, res, next) => {

    const { rawMsg } = req

    if (rawMsg == '签到') {
        return signIn(req, res)
    }

    next()
}


module.exports.__help = [
    ['签到', '签到']
]