const axios = require('axios')

/**
 * @function 发送私聊消息
 * @param {number} userId 
 * @param {string} msg 
 * @returns viod
 */
module.exports.sendPrivateMsg = (userId, msg) => axios({ url: `http://127.0.0.1:5700/send_private_msg?user_id=${userId}&message=${msg}&auto_escape=false`, method: 'get' })

/**
 * @function 发送群聊消息
 * @param {number} groupId 
 * @param {string} msg 
 * @returns 
 */
module.exports.sendGroupMsg = (groupId, msg) => axios({ url: `http://127.0.0.1:5700/send_group_msg?group_id=${groupId}&message=${msg}&auto_escape=false`, method: 'get' })

/**
 * @function 获取群友信息
 * @param {number} groupId 
 * @param {number} userId 
 * @returns 
 */
module.exports.getGroupMemberInfo = (groupId, userId) => axios({ url: `http://127.0.0.1:5700/get_group_member_info?group_id=${groupId}&user_id=${userId}`, method: 'get' })


/**
 * @function 随机壁纸接口1
 * @param {string} keyword 可选关键词 ['美女', '汽车', '二次元', '背景', '动漫']
 * @returns 
 */
module.exports.getRandomPaper = (keyword) => axios({ url: `https://api.uomg.com/api/rand.img1?sort=${keyword}&format=json`, method: 'get' })

/**
 * @function 随机壁纸接口2,默认获取二次元壁纸
 * @returns 
 */
module.exports.getRandomPaper2 = () => axios({ url: 'https://www.dmoe.cc/random.php?return=json', method: 'get' })

/**
 * @function 舔狗日记接口
 * @returns 
 */
module.exports.getTGDiary = () => axios({ url: 'https://api.ixiaowai.cn/tgrj/index.php', method: 'get' })