import { BACK_FS_URL } from '@/global'

export default {
  // 返回文件的完整url
  getFileUrl(file: any) {
    return `${BACK_FS_URL()}${file.path}`
  },
  // 返回文件的完整缩略图url
  getThumbUrl(file: any) {
    return file.thumbPath ? `${BACK_FS_URL()}${file.thumbPath}` : ''
  },
  postMessage(callback: any) {
    let target = window.parent
      ? window.parent
      : window.opener
      ? window.opener
      : false
    if (target) {
      const data = typeof callback === 'function' ? callback() : callback
      if (data) {
        let posted = JSON.parse(JSON.stringify(data))
        target.postMessage(posted, '*')
      }
    }
  },
  // 根据文件后缀判断文件类型
  matchType(fileName: string) {
    let suffix = ''
    let result: string | boolean = ''
    try {
      let flieArr = fileName.split('.')
      suffix = flieArr[flieArr.length - 1]
    } catch (err) {
      suffix = ''
    }
    // fileName无后缀返回 false
    if (!suffix) {
      result = false
      return result
    }
    // 图片格式
    let imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
    // 进行图片匹配
    result = imglist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'image'
      return result
    }
    // 匹配txt
    let txtlist = ['txt']
    result = txtlist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'txt'
      return result
    }
    // 匹配 excel
    let excelist = ['xls', 'xlsx']
    result = excelist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'excel'
      return result
    }
    // 匹配 word
    let wordlist = ['doc', 'docx']
    result = wordlist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'word'
      return result
    }
    // 匹配 pdf
    let pdflist = ['pdf']
    result = pdflist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'pdf'
      return result
    }
    // 匹配 ppt
    let pptlist = ['ppt', 'pptx']
    result = pptlist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'ppt'
      return result
    }
    // 匹配 视频
    let videolist = ['mp4', 'm2v', 'mkv']
    result = videolist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'video'
      return result
    }
    // 匹配 音频
    let radiolist = ['mp3', 'wav', 'wmv']
    result = radiolist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'radio'
      return result
    }
    // 其他 文件类型
    result = 'other'
    return result
  },
}
