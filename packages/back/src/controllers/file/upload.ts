import { ResultData, ResultFault } from 'tms-koa'
import { UploadCtrl } from 'tms-koa/dist/controller/fs'
import LocalFD from 'tms-finder-model'

/** 上传文件控制器类 */
class Upload extends UploadCtrl {
  async tmsBeforeEach() {
    const result = await super.tmsBeforeEach()
    if (result instanceof ResultFault) {
      return result
    }
    this['localFD'] = new LocalFD(this['domain'], this['bucket'])
    return true
  }
  /**
   * @swagger
   *
   * /file/upload/mkdir:
   *   get:
   *     tags:
   *       - upload
   *     summary: 在指定目录下创建目录
   *     parameters:
   *       - $ref: '#/components/parameters/domain'
   *       - $ref: '#/components/parameters/bucket'
   *       - $ref: '#/components/parameters/dir'
   *     responses:
   *       200:
   *         $ref: '#/components/responses/ResponseOK'
   *
   */
  mkdir() {
    const { dir } = this['request'].query
    const result = this['localFD'].mkdir(dir)
    if (false === result[0]) return new ResultFault(result[1])

    return new ResultData('ok')
  }
  /**
   * @swagger
   *
   * /file/upload/rmdir:
   *   get:
   *     tags:
   *       - upload
   *     summary: 在指定目录下删除目录
   *     parameters:
   *       - $ref: '#/components/parameters/domain'
   *       - $ref: '#/components/parameters/bucket'
   *       - $ref: '#/components/parameters/dir'
   *     responses:
   *       200:
   *         $ref: '#/components/responses/ResponseOK'
   *
   */
  rmdir() {
    const { dir } = this['request'].query
    const result = this['localFD'].rmdir(dir)
    if (false === result[0]) return new ResultFault(result[1])

    return new ResultData('ok')
  }
}

export default Upload
