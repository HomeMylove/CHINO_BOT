const schedule = require('node-schedule');
const { db } = require('../../../db/createDB')


const reset = () => {
    `
    * * * * * *
    ┬ ┬ ┬ ┬ ┬ ┬
    │ │ │ │ │ |
    │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
    │ │ │ │ └───── month (1 - 12)
    │ │ │ └────────── day of month (1 - 31)
    │ │ └─────────────── hour (0 - 23)
    │ └──────────────────── minute (0 - 59)
    └───────────────────────── second (0 - 59, OPTIONAL)
    `
    schedule.scheduleJob('0 0 0 * * *', () => {

        // 如果未签到，签到天数改为0
        const sqlStr1 = "UPDATE qq_robot SET data_json = JSON_SET(data_json, '$.checkInDays',0,'$.notCheckInDays',(json_extract(data_json, '$.notCheckInDays') + 1)) WHERE data_json->'$.checkInStatus'=false"

        // 如果签到，将未签到天数改为0
        const sqlStr2 = "UPDATE qq_robot SET data_json = JSON_SET(data_json, '$.notCheckInDays',0) WHERE data_json->'$.checkInStatus'=true"
            // 将最高记录归零
        const sqlStr3 = "UPDATE qq_robot SET data_json = JSON_SET(data_json, '$.checkInRecords', 1) WHERE data_json->'$.notCheckInDays'=2"
            // 将 签到状态 和 购买状态 重置
        const sqlStr4 = "UPDATE qq_robot SET data_json = JSON_SET(data_json, '$.checkInStatus',false,'$.goods.g1.status',false,'$.goods.g2.status',false,'$.goods.g3.status',false,'$.goods.g4.status',false)"


        new Promise((resove, reject) => {
            db.query(sqlStr1, [], (err, results) => {
                if (err) return console.log('重置天数失败' + new Date(), err);

                resove('ok1')
            })
        }).then(value => {
            console.log(value);
            db.query(sqlStr2, [], (err, results) => {
                if (err) return console.log('重置签到状态和购买状态失败' + new Date(), err);

                return 'ok2'
            })
        }).then(value => {
            console.log(value);
            db.query(sqlStr3, [], (err, results) => {
                if (err) return console.log('重置最高记录失败' + new Date(), err);

                return 'ok3'
            })
        }).then(value => {
            console.log(value);
            db.query(sqlStr4, [], (err, results) => {
                if (err) return console.log('重置签到状态和购买状态失败' + new Date(), err);

                return 'ok4'
            })
        }).then(value => {
            console.log(value);
        })
    });

}

module.exports = reset