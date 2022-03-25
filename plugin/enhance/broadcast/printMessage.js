const countDays = require('./countDays')

/**
 * @function 返回msg内容
 * @returns
 */
module.exports = () => {
    const words = []
    const time = new Date()
    const year = time.getFullYear()
    const month = time.getMonth() + 1
    const date = time.getDate()
    const weekList = ['日', '一', '二', '三', '四', '五', '六']
    const dayIndex = time.getDay()
    const day = weekList[dayIndex] // 周几

    const first = `今天是${year}年${month}月${date}日 星期${day}`
    words.push(first)

    let today
    switch (dayIndex) {
        case 0:
        case 6:
            today = '今天是周末'
            break;
        case 5:
            const h = Math.round(24 - time.getHours())
            today = `现在距离周末还剩${h}小时`
        default:
            today = `今天距离周末还剩${5-dayIndex}天`
            break;
    }
    words.push(today)

    const qingMing = new Date(2022, 3, 3)
    const labourDay = new Date(2022, 3, 30)
    const dragonBoat = new Date(2022, 5, 3)
    const midAutumn = new Date(2022, 8, 10)
    const nationalDay = new Date(2022, 9, 1)
    const christmas = new Date(2022, 11, 25)
    const newYear = new Date(2023, 0, 1)
    const springFestival = new Date(2023, 0, 22)
    const eventWish = new Date(2022, 2, 29, 14, 59, 59)

    words.push(`距离雷神/心海卡池结束${countDays(eventWish)}`)
    words.push(`距离元旦假期${countDays(newYear)}`)
    words.push(`距离春节假期${countDays(springFestival)}`)
    words.push(`距离清明假期${countDays(qingMing)}`)
    words.push(`距离劳动假期${countDays(labourDay)}`)
    words.push(`距离端午假期${countDays(dragonBoat)}`)
    words.push(`距离中秋假期${countDays(midAutumn)}`)
    words.push(`距离国庆假期${countDays(nationalDay)}`)
        // words.push(`距离圣诞节${countDays(christmas)}`)
    return words.join('\n')
}