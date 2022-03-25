const getWallpaper = require('./getWallpaper')
const flattererDiary = require('./flattererDiary')


/**
 * @function 一些随机的API
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = (req, res, next) => {

    const { rawMsg } = req

    if (rawMsg.indexOf('随机壁纸') === 0) {
        return getWallpaper(req, res)
    } else if (rawMsg[0] == '舔' && rawMsg.substring(rawMsg.length - 2) == '日记') {
        return flattererDiary(req, res)
    }

    next()
}


module.exports.__help = [
    ['随机壁纸', '随机壁纸 美女|汽车|二次元|背景|动漫 (默认二次元)'],
    ['舔狗日记', '舔狗日记 | 舔主人日记']
]