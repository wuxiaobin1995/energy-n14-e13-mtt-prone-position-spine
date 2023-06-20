/*
 * @Author      : Mr.bin
 * @Date        : 2021-11-01 16:17:34
 * @LastEditTime: 2022-01-19 11:02:19
 * @Description : PDF
 */
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import moment from 'moment'
require('./FZHTJW-normal.js') // 用于中文转码

function getBase64(img) {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  const ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
  const dataURL = canvas.toDataURL('image/' + ext)
  return dataURL
}

export function htmlToPdf(domName, pdfName, setHeight = 580) {
  const element = document.getElementById(domName) // 这个dom元素是要导出pdf的div容器
  const w = element.scrollHeight + 'px' // 获得该容器的宽
  const h = element.scrollWidth + 'px' // 获得该容器的高
  const offsetTop = element.offsetTop // 获得该容器到文档顶部的距离
  const offsetLeft = element.offsetLeft // 获得该容器到文档最左的距离
  const canvas = document.createElement('canvas')
  window.pageYoffset = 0
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  let abs = 0
  const win_i = document.body.clientWidth // 获得当前可视窗口的宽度（不包含滚动条）
  const win_o = window.innerWidth // 获得当前窗口的宽度（包含滚动条）
  if (win_o > win_i) {
    abs = (win_o - win_i) / 2 // 获得滚动条长度的一半
  }
  canvas.width = w * 2 // 将画布宽&&高放大两倍
  canvas.height = h * 2
  const context = canvas.getContext('2d')
  context.scale(2, 2)
  context.translate(-offsetLeft - abs, -offsetTop)
  // 这里默认横向没有滚动条的情况，因为offset.left(),有无滚动条的时候存在差值，因此
  // translate的时候，要把这个差值去掉

  html2Canvas(element, {
    allowTaint: true, //允许跨域
    useCORS: true, //允许图片跨域
    scale: 2 // 提升画面质量，但是会增加文件大小
  }).then(canvas => {
    const contentWidth = canvas.width
    const contentHeight = canvas.height
    // 一页pdf显示html页面生成的canvas高度
    const pageHeight = (contentWidth / 595) * 842 // a4纸的尺寸842×595，html页面生成的canvas在pdf中图片的宽高
    // 未生成pdf的html页面高度
    let leftHeight = contentHeight
    // 页面偏移
    let position = 0

    // 需打印内容的宽高
    const imgWidth = 842
    const imgHeight = setHeight

    const pageData = canvas.toDataURL('image/jpeg', 1.0)

    const pdf = new JsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4'
    })

    // 有两个高度需要区分，一个是html页面的实际高度，一个是生成pdf的页面高度(842)
    // 当内容未超过pdf一页显示的范围，无需分页
    // pdf.addImage(pageData, 'JPEG', 距左，距上，宽度，高度)
    if (leftHeight < pageHeight) {
      pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
    } else {
      // 分页
      while (leftHeight > 0) {
        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
        leftHeight -= pageHeight
        position -= 842
        // 避免添加空白页
        if (leftHeight > 0) {
          pdf.addPage()
        }
      }
    }

    // 添加一些文字
    pdf.setFont('FZHTJW')
    pdf.setFontSize(10)
    pdf.text(330, 585, `打印时间：${moment().format('YYYY-MM-DD HH:mm:ss')}`)

    pdf.save(pdfName + '.pdf')
  })
}
