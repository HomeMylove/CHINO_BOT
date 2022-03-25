// const autoChat = require('./autoChat/index')
const callName = require('./common/callName/index')
const diceGame = require('./common/diceGame/index')
const signIn = require('./common/signIn/index')
const randomAPI = require('./common/randomAPI/index')
const genshin = require('./common/genshin/index')
const echo = require('./common/echo/index')
const shop = require('./common/shop/index')
const quote = require('./common/quote/index')

const control = require('./enhance/control/index')
const judgeName = require('./enhance/judgeName/index')
const poke = require('./enhance/poke/index')
const reply = require('./enhance/reply/index')
const repeater = require('./enhance/repeater/index')

module.exports = {
    signIn,
    diceGame,
    callName,
    randomAPI,
    quote,
    genshin,
    echo,
    shop,

    control,
    repeater,
    judgeName,
    poke,
    reply
}