/*
 * @Author      : Mr.bin
 * @Date        : 2023-04-14 16:37:12
 * @LastEditTime: 2023-06-16 22:29:40
 * @Description : vue.config.js
 */

const projectName = 'energy-n14-e13-mtt-prone-position-spine' // 项目名称，是一个程序的唯一标识符
const softwareName = '卧姿肢体康复评估与训练系统-MTT版' // 软件名称

const logo = './public/ico/logo/medical.ico' // 软件图标（医疗）
// const logo = './public/ico/logo/power.ico' // 软件图标（运动）
// const logo = './public/ico/logo/common.ico' // 软件图标（通用）

module.exports = {
  /* 全局css配置 */
  css: {
    loaderOptions: {
      scss: {
        /*
         * 这一段代码的作用，原理就是在每一个注册了路由的vue文件的style头部和scss文件的头部加上 @import '@/style/index.scss';
         * 这里建议导入css变量、mixin、函数。相反，样式重置表和acss等的应该放在main.js中导入
         * 注意：sass-loader 8版本叫prependData，8+版本叫additionalData，8-版本叫data
         */
        prependData: `@import '@/style/global-output.scss';`
      }
    }
  },

  /* 插件配置 */
  pluginOptions: {
    /* electron-builder打包插件 */
    electronBuilder: {
      /* 开启node集成 */
      nodeIntegration: true,
      /* 加载编译原生模块 */
      externals: ['serialport', 'ffi-napi'],
      /* 打包配置 */
      builderOptions: {
        appId: projectName, // 必须要设置，是一个程序的唯一标识符，还与后面的程序自动更新有关
        productName: softwareName, // 安装包名
        copyright:
          'Copyright © Guangdong Energy Life Sport Rehabilitation Company', // 版权信息，广东安捷力运动康复有限公司
        asarUnpack: ['dll/*.dll'], // 单独把dll文件抽离出来，放到resources/app.asar.unpacked文件夹中
        /* window相关配置 */
        win: {
          // requestedExecutionLevel: 'requireAdministrator', // 获取管理员权限
          icon: logo, // 软件图标，必须是≥256*256的ico格式
          target: [
            {
              target: 'nsis', // 利用nsis制作安装程序
              arch: [
                // 这个意思是打出来32 bit、64 bit的包
                'x64' // 64位
                // 'ia32' // 32位
              ]
            }
          ]
        },
        /* nsis安装界面配置 */
        nsis: {
          oneClick: false, // 是否一键安装
          perMachine: true, // 是否总是针对所有用户（每台机器）进行安装
          allowElevation: true, // 是否允许请求提升。如果为false，则用户必须使用提升的权限重新启动安装程序
          allowToChangeInstallationDirectory: false, // 允许修改安装目录
          installerIcon: './public/ico/install/common.ico', // 安装图标
          uninstallerIcon: './public/ico/delete/common.ico', // 卸载图标
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          shortcutName: softwareName // 图标名称
        }
      }
    }
  }
}
