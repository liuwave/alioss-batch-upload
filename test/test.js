let aliOssBatchUpload = require('../');

let handler = new aliOssBatchUpload({
  accessKeyId: '',
  accessKeySecret: '',
  region: 'oss-cn-beijing',
  bucket: '*',
  ossDir: '/test/',//阿里云OSS根目录，默认为'/',
  pattern: '',
  internal: false
})

handler.upload('./')