const { robotName } = require('../../../config')


module.exports = [
    // 我是谁
    [`${robotName}不会忘记$name,$name也不要忘记${robotName}哦`,
        `${robotName}的记性可是很好的,你就是$name吧`,
        `$name~,又在拿${robotName}寻开心吗?`
    ],
    // 你是我的谁
    [
        `$name,请...请不要捉弄${robotName}了`,
        `$name,你忘记${robotName}了吗`
    ],
    // 我是你的谁
    [
        `智乃当然不会忘记,你是我的$name呀`,
    ]
]