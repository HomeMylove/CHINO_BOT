const { sendPrivateMsg, sendGroupMsg } = require('../../api/requests')


/**
 * @function 发送一条消息
 * @param {object} msgContent 发送的对象
 * @param {int} msgContent.groupId 发送到群组
 * @param {int} msgContent.userId 发送给好友
 * @param {string} msgContent.msg 信息主体
 * @param {string} msgContent.imgUrl 图片url，多张图片请在写在msg中
 */
module.exports = async(msgContent) => {

    let { groupId, userId, msg, imgUrl } = msgContent

    msg = msg || ''
    if (imgUrl) msg = msg + `[CQ:image,file=${imgUrl}]`
    const rMsg = msg
    msg = encodeURI(msg)

    let result

    if (userId) {

        result = await sendPrivateMsg(userId, msg)

    } else if (groupId) {

        result = await sendGroupMsg(groupId, msg)

    } else {
        return
    }
    console.log(result.status, rMsg);
}