/*
 * @Author      : Mr.bin
 * @Date        : 2023-06-16 21:32:53
 * @LastEditTime: 2023-06-20 17:12:11
 * @Description : Vuex
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    /* 订单号 */
    orderId: '',

    /* 当前登录的用户及其信息 */
    currentUserInfo: {
      userId: '', // 用户id
      userName: '', // 姓名
      sex: '', // 性别（男、女）
      height: '', // 身高
      weight: '', // 体重
      birthday: '', // 出生日期
      admission: '', // 住院号
      stage: '' // MTT分期类型
    },

    /* 参数配置数组 */
    settings: [],

    /* 下一个设备的名称（用于结束后提示下一个设备，增加用户体验） */
    nextDevice: '',

    /* 语音开关 */
    voiceSwitch: true,

    /* 最大、最小活动度值 */
    bothFlexibility: {
      maxDepth: null,
      minDepth: null
    }
  },

  mutations: {
    /* 订单号 */
    SET_ORDERID(state, orderId) {
      state.orderId = orderId
    },

    /* 当前登录的用户及其信息 */
    CHANGE_CURRENTUSERINFO(state, currentUserInfo) {
      state.currentUserInfo = currentUserInfo
    },

    /* 参数配置数组 */
    SET_SETTINGS(state, settings) {
      state.settings = settings
    },

    /* 下一个设备的名称（用于结束后提示下一个设备，增加用户体验） */
    SET_NEXTDEVICE(state, nextDevice) {
      state.nextDevice = nextDevice
    },

    /* 语音开关 */
    SET_VOICESWITCH(state, voiceSwitch) {
      state.voiceSwitch = voiceSwitch
    },

    /* 最大、最小活动度值 */
    SET_BOTHFLEXIBILITY(state, bothFlexibility) {
      state.bothFlexibility = bothFlexibility
    }
  },

  actions: {
    /* 订单号 */
    setOrderId({ commit }, orderId) {
      return new Promise((resolve, reject) => {
        commit('SET_ORDERID', orderId)
        resolve()
      })
    },

    /* 当前登录的用户及其信息 */
    changeCurrentUserInfo({ commit }, currentUserInfo) {
      return new Promise((resolve, reject) => {
        commit('CHANGE_CURRENTUSERINFO', currentUserInfo)
        resolve()
      })
    },

    /* 参数配置数组 */
    setSettings({ commit }, settings) {
      return new Promise((resolve, reject) => {
        commit('SET_SETTINGS', settings)
        resolve()
      })
    },

    /* 下一个设备的名称（用于结束后提示下一个设备，增加用户体验） */
    setNextDevice({ commit }, nextDevice) {
      return new Promise((resolve, reject) => {
        commit('SET_NEXTDEVICE', nextDevice)
        resolve()
      })
    },

    /* 语音开关 */
    setVoiceSwitch({ commit }, voiceSwitch) {
      return new Promise((resolve, reject) => {
        commit('SET_VOICESWITCH', voiceSwitch)
        resolve()
      })
    },

    /* 最大、最小活动度值 */
    setBothFlexibility({ commit }, bothFlexibility) {
      return new Promise((resolve, reject) => {
        commit('SET_BOTHFLEXIBILITY', bothFlexibility)
        resolve()
      })
    }
  }
})
