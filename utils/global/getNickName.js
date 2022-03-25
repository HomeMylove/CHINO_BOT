const { robotName, robotNicknames } = require('../../config')

const nickNames = [robotName, ...robotNicknames]

/**
 * @function 获取语句中的起始名字
 * @param {String} rawMsg 原始语句
 * @returns name 最匹配的名字
 */
module.exports = rawMsg => {

    let name = ''

    for (let i = 0; i < nickNames.length; i++) {

        let item = nickNames[i]

        if (rawMsg.indexOf(item) == 0 && item.length >= name.length) {

            name = item

        }

    }

    return name

}