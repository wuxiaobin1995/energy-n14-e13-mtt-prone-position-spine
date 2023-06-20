/*
 * @Author      : Mr.bin
 * @Date        : 2023-04-14 17:23:07
 * @LastEditTime: 2023-06-20 16:50:28
 * @Description : 封装axios
 */
import axios from 'axios'

const instance = axios.create({
  baseURL: '', // 局域网
  timeout: 8000
})

export { instance }
