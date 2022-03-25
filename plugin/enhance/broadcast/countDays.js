/**
 * @function 返回天数或小时数
 * @param {object} startTime 
 * @param {object} endTime 
 * @returns 
 */
module.exports = (endTime, startTime = new Date()) => {

    const pastTime = endTime - startTime

    const days = Math.floor(pastTime / (1000 * 60 * 60 * 24))

    if (days == 0) {
        const hours = Math.round((pastTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

        return hours + '小时'
    }
    return days + '天'
}