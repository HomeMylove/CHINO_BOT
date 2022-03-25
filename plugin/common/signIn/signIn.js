const { createSignInImg } = require('./createSignInImg')
const { processData } = require('./processData')

const tableName = 'qq_robot'

function signIn(req, res) {

    const { groupId, userId, sender } = req

    const nickname = sender['card'] || sender['nickname'] // 对方的昵称

    const user = {
        user_id: userId,
        group_id: groupId
    }

    res.selectData(tableName, user).then(results => {
        // 长度不为1,就是没有
        if (results.length !== 1) {
            //插入新数据
            res.insertData(tableName, user).then(results => {

                if (results.affectedRows == 1) {
                    const rawData = {
                            exp: 0, // 经验
                            level: 1, // 等级
                            coins: 0, // 硬币
                            checkInStatus: false, // 签到状态
                            checkInDays: 0, // 连续天数
                            notCheckInDays: 0, // 未签到天数 
                            checkInRecords: 0, // 上次连续记录
                            double: false, // 是否开启双倍经验
                        }
                        // 数据加工
                    const { userInfo, flags } = processData(rawData)

                    const newData = {
                        data_json: JSON.stringify(userInfo)
                    }

                    res.updateData(tableName, user, newData).then(results => {
                        if (results.affectedRows == 1) {
                            createSignInImg({
                                userId,
                                groupId,
                                nickname,
                                data: userInfo,
                                flags
                            }).then(() => {
                                res.sendMsg({
                                    groupId,
                                    imgUrl: `signIn/temp/${groupId}and${userId}.jpg`
                                })
                            }, (error) => {
                                console.log(error)
                            })
                        }
                    })
                }
            })
        } else {
            // 含有数据
            const result = results[0]
            let rawData
            if (!result['data_json']) {
                rawData = {
                    exp: 0, // 经验
                    level: 1, // 等级
                    coins: 0, // 硬币
                    checkInStatus: false, // 签到状态
                    checkInDays: 0, // 连续天数
                    notCheckInDays: 0, // 未签到天数
                    checkInRecords: 0, // 上次连续记录
                    double: false, // 是否开启双倍经验
                }
            } else {
                rawData = JSON.parse(result['data_json'])
            }

            const { userInfo, flags } = processData(rawData)

            const newData = {
                data_json: JSON.stringify(userInfo)
            }

            res.updateData(tableName, user, newData).then(results => {
                if (results.affectedRows == 1) {
                    createSignInImg({
                        userId,
                        groupId,
                        nickname,
                        data: userInfo,
                        flags
                    }).then(() => {
                        res.sendMsg({
                            groupId,
                            imgUrl: `signIn/temp/${groupId}and${userId}.jpg`
                        })
                    }, (error) => {
                        console.log(error)
                    })
                }
            })
        }
    })


}
module.exports.signIn = signIn