const answer = require('./answer')
const echo = require('./echo')
const show = require('./show')
const update = require('./update')
const deleteEcho = require('./delete')

/**
 * @function echo功能
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = async(req, res, next) => {
    const { rawMsg } = req
    if (rawMsg.indexOf('echo') == 0) {
        return echo(req, res)
    } else if (rawMsg.indexOf('show') == 0) {
        return show(req, res)
    } else if (rawMsg.indexOf('update') == 0) {
        return update(req, res)
    } else if (rawMsg.indexOf('delete') == 0) {
        return deleteEcho(req, res)
    } else {
        try {
            const result = await answer(req, res)
            if (!result) next()
        } catch (error) {
            console.log(error, 'echo')
        }
    }
}


module.exports.__help = [
    ['echo', 'echo 你是谁? 我是智乃。(请使用文明用语,构建和谐社会)\nupdate id=12 我是谁? 老公\nshow\ndelete id=12']
]