/*
 * @Author      : Mr.bin
 * @Date        : 2021-09-10 17:55:37
 * @LastEditTime: 2023-06-20 16:54:01
 * @Description : 日志记录
 */
import log4js from 'log4js'

log4js.configure({
  appenders: {
    production: {
      type: 'dateFile', // 日志输出类型，dateFile表示输出到文件
      filename: 'C:/Energy_Life_Log/卧姿肢体康复评估与训练系统-MTT版.log', // 输出到文件的文件路径，注意，是路径而不是文件名
      alwaysIncludePattern: true, // 日志文件是否展示预设的模式
      keepFileExt: true, // 日志文件是否始终保持后缀
      daysToKeep: 0 // 日志保留几天，默认值为0，表示永久保存
    }
  },
  categories: {
    default: { appenders: ['production'], level: 'info' }
  }
})

export function getLogger(text) {
  const logger = log4js.getLogger()
  logger.info(text + '\n')
}
