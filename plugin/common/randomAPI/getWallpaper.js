const { getRandomPaper, getRandomPaper2 } = require('../../../api/requests')

/**
 * @function 获取一张壁纸
 * @param {object} body 
 * @param {object} res 使用res上的方法
 */
module.exports = async(req, res) => {

    const { rawMsg, groupId } = req

    const keyWord = rawMsg.replace('随机壁纸', '').trim()

    const list = ['美女', '汽车', '二次元', '背景', '动漫']

    let result

    try {

        if (list.indexOf(keyWord) !== -1) {
            result = await getRandomPaper(encodeURI(keyWord))
        } else {
            result = await getRandomPaper2()
        }

        if (result['data']) {
            const imgUrl = result['data']['imgurl']

            return res.sendMsg({
                groupId,
                imgUrl
            })
        }
    } catch (error) {
        console.log(error);
    }
}