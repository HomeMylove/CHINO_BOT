const showQuote = require('./showQuote')

/**
 * @function 群语录
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = (req, res, next) => {

    const { rawMsg } = req

    if (rawMsg == '群语录') {
        return showQuote(req, res)
    }

    next()
}