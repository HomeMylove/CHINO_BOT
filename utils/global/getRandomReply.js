/**
 * @function 返回一个随机数组元素
 * @param {arrary} arr 传入包含若干回复的数组
 * @returns 随机元素
 */
module.exports = (arr) => {
    let num = arr.length
    num = Math.floor(Math.random() * num)
    return arr[num]
}