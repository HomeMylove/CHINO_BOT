const fs = require('fs')
const path = require('path')

const imgPath = path.join(__dirname, '../../../../data/images/quote')

/**
 * @function 返回一张群语录
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports = (req, res) => {
    const { groupId } = req
    const groups = fs.readdirSync(imgPath)
    if (groups.indexOf(groupId.toString()) !== -1) {
        const imgs = fs.readdirSync(path.join(imgPath, groupId.toString()))

        res.sendMsg({
            groupId,
            imgUrl: path.join('/quote', groupId.toString(), imgs[Math.floor(Math.random() * imgs.length)])
        })
    } else {
        return res.sendMsg({
            groupId,
            msg: '本群暂时没有群语录,请向我的主人投稿吧'
        })
    }
}