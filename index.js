const Robot = require('./app')

const robot = new Robot()


// 定时任务
const broadcast = require('./plugin/enhance/broadcast/index')
const reset = require('./plugin/enhance/schedule/reset')
broadcast()
reset()


// 全局函数
const { sendMsg, getNickName, getRandomReply } = require('./utils/global/index')
robot.common('sendMsg', sendMsg)



robot.common('getNickName', getNickName)
robot.common('getRandomReply', getRandomReply)

// 数据库函数
const { selectData, insertData, updateData } = require('./utils/dbFuns/index')
robot.common('selectData', selectData)
robot.common('insertData', insertData)
robot.common('updateData', updateData)


// 引入插件
const plugins = require('./plugin/index')
robot.method(plugins.poke)
robot.method(plugins.signIn) // 签到
robot.method(plugins.shop)
robot.method(plugins.judgeName)
robot.method(plugins.reply)


robot.method(plugins.control)

robot.method(plugins.quote)
robot.method(plugins.genshin)
robot.method(plugins.diceGame) // 骰子
robot.method(plugins.callName) // 记住我
robot.method(plugins.randomAPI)
robot.method(plugins.echo)

robot.method(plugins.repeater)

// 开启监听
robot.listen(5701, () => {
    console.log('serve is RUNNING AT 127.0.0.1:5701')
})