const { db } = require('../../../db/createDB')

const path = require('path')

const imgPath = path.join(__dirname, '../../../../data/images/shop')

const sharp = require('sharp')

/**
 * @function 展示商店
 * @param {*} req 
 * @param {*} res 
 */
module.exports = (req, res) => {

    const { groupId, userId } = req

    const sqlStr = 'SELECT * FROM qq_robot WHERE group_id=? AND user_id=?'

    db.query(sqlStr, [groupId, userId], (err, results) => {
        if (err) {
            return res.sendMsg({
                groupId,
                msg: '读取商店失败'
            })
        }


        if (results.length == 1) {

            const data = JSON.parse(results[0]['data_json'])

            if (!data) {
                return res.sendMsg({
                    groupId,
                    msg: '客人您还没有任何金币哦,金币可通过"签到"获得'
                })
            }

            let { coins, goods, level } = data

            goods = goods || { g1: { status: false, num: 0 }, g2: { status: false, num: 0 }, g3: { status: false, num: 0 }, g4: { status: false } } // 我的商品

            createShop({ goods, coins, level, groupId, userId }).then(
                () => {
                    res.sendMsg({
                        groupId,
                        imgUrl: `shop/temp/${groupId}and${userId}.png`
                    })
                },
                error => {
                    console.log(error, 'showGoods')
                }
            )

        } else {
            return res.sendMsg({
                groupId,
                msg: '客人您还没有任何金币哦,金币可通过"签到"获得'
            })
        }
    })
}

/**
 * @function 合成商店
 * @param {object} goods 
 */
async function createShop({ goods, coins, level, groupId, userId }) {

    const coverList = []

    let i = 0

    for (let key in goods) {

        // 售罄图标
        if (goods[key]['status']) {

            const img = {
                input: path.join(imgPath, 'out.png'),
                top: 145 + i * 130,
                left: 820,
            }

            coverList.push(img)

        }

        // 折扣图标

        if (level > 1) {
            level = level <= 10 ? level : 10
            let dis = {
                input: path.join(imgPath, `discount/${level-1}0off.png`),
                top: 170 + i * 130,
                left: 1070
            }

            coverList.push(dis)
        }
        i++
    }

    const time = restTime()

    const width = 1198
    const height = 846

    const svgImage = `
        <svg width="${width}" height="${height}">
        <style>
        <font>
        <font-face font-family="SimSun SimHei YouYuan"/>
        </font>
        .title{
            fill:red;
            font-size:30px;
            font-weight:400;
            font-family:"SimHei";
        }
        </style>
        <text x="66%" y="83%"  class="title" >${time}</text>
        <text x="86%" y="83%"  class="title" >${coins}</text>
        </svg>
        `
    const svgBuffer = Buffer.from(svgImage)

    coverList.push({
        input: svgBuffer,
        top: 0,
        left: 0
    })

    await sharp(path.join(imgPath, '/shop.png'))
        .composite(coverList)
        .toFile(path.join(imgPath, `/temp/${groupId}and${userId}.png`))

}

/**
 * @function 获取售卖剩余时间
 * @returns 剩余时间
 */
function restTime() {

    const now = new Date()

    let hour = 24 - 1 - now.getHours()
    let min = 60 - 1 - now.getMinutes()
    let sec = 60 - 1 - now.getSeconds()

    hour = hour < 10 ? '0' + hour : hour
    min = min < 10 ? '0' + min : min
    sec = sec < 10 ? '0' + sec : sec

    return `${hour}:${min}:${sec}`

}