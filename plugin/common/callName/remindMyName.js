// 导入配置
const config = require('../../../config')
const reply = require('./reply')

const tableName = 'qq_robot'

/**
 * @function 想起一个名字
 * @param {*} req 
 * @param {*} res 
 */
module.exports = (req, res) => {

    const { groupId, userId, sender, rawMsg } = req

    const card = sender['card'] || sender['nickname']

    const user = {
        user_id: userId,
        group_id: groupId
    }

    res.selectData(tableName, user).then(results => {

        let flag

        switch (rawMsg) {
            case '我是谁':
                flag = 1
                break;
            case '你是我的谁':
                flag = 2
                break;
            case '我是你的谁':
                flag = 3
                break;
            default:
                break;
        }


        if (results[0] && results[0]['name']) {
            let name = results[0]['name']

            if (name == '主人') {
                return res.sendMsg({
                    groupId,
                    msg: `${config.robotName}怎么会忘记呢,你是我的主人呀`
                })
            }


            let msg
            if (flag == 1) {
                msg = res.getRandomReply(reply[0]).replace(/\$name/g, name)
            } else if (flag == 2) {
                if (name.length >= 2) {
                    name = name.substring(0, 1) + '...' + name
                }
                msg = res.getRandomReply(reply[1]).replace(/\$name/g, name)
            } else {
                msg = res.getRandomReply(reply[2]).replace(/\$name/g, name)
            }
            return res.sendMsg({
                groupId,
                msg
            })
        } else {
            const msg = `嗯~~你就是${card}对吧`
            return res.sendMsg({ groupId, msg })
        }
    })
}