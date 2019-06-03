const oss = require('ali-oss');
const path = require("path");
const rd = require("rd");
const ProgressBar = require('progress');


let AliOSSBatchUpload = function (options) {
  options = options || {};
  if (!options.accessKeyId) {
    console.log('accessKeyId required');
    return;
  }
  if (!options.accessKeyId) {
    console.log('accessKeySecret required');
    return;
  }
  this.accessKeyId = options.accessKeyId || '';
  this.accessKeySecret = options.accessKeySecret || '';
  this.region = options.region;
  this.bucket = options.bucket;
  this.internal = options.internal || false;
  this.delete = options.delete || false;
  this.timeout = options.timeout || '60s';
  this.ossDir = options.ossDir || '';
  this.pattern = options.pattern || function (filename) {
    return filename.indexOf('node_modules') < 0
  };
}
AliOSSBatchUpload.prototype.upload = async function (dir, options) {
  options = options || {};
  this.region = options.region || this.region;
  this.bucket = options.bucket || this.bucket;
  if (!this.region) {
    console.log('region required');
    return;
  }
  if (!this.bucket) {
    console.log('bucket required');
    return;
  }
  this.ossDir = options.ossDir || this.ossDir;

  if (this.ossDir.endsWith('/')) {
    this.ossDir = this.ossDir.substr(1)
  }
  this.pattern = options.pattern || this.pattern;

  this.internal = options.internal !== undefined ? options.internal : this.internal;
  this.delete = options.delete !== undefined ? options.delete : this.delete;

  this.timeout = options.timeout || this.timeout;


  const client = oss({
    region: this.region,
    accessKeyId: this.accessKeyId,
    accessKeySecret: this.accessKeySecret,
    bucket: this.bucket,
    internal: this.internal,
    timeout: this.timeout
  });
  let upload_path = path.resolve(dir)
  let successCount = 0;
  let failCount = 0;
  let that = this;


  const put = async function (object, file) {

    try {
      // object表示上传到OSS的Object名称，file表示本地文件或者文件路径
      let result = await client.put(object, file);
      return true;
    } catch (e) {
      return e.message;
    }
  }
  let allFiles = [];
  console.log('扫描文件中...');
  let readBar = new ProgressBar('已扫描:atotal个文件', {total: 50});

  rd.eachFileFilterSync(upload_path, this.pattern,
    function (filename, stats) {

      let key = path.join(that.ossDir, filename.replace(upload_path, ''));
      key = key.replace(/\\/mg, '\/');
      if (key.substr(0, 1) === '/') {
        key = key.substr(1);
      }
      allFiles.push({
        key: key,
        file: filename
      })
      readBar.tick(50, {
        atotal: allFiles.length,
      })
    }
  );

  if (allFiles.length <= 0) {
    console.log('没有可上传的文件');
    return;
  }
  console.log('扫描完成，共扫描' + allFiles.length + '个文件');
  console.log('开始上传');

  let bar = new ProgressBar('[:bar]   :finished/:atotal 出错:failCount个 :file', {total: 50});

  let i = 0, length = allFiles.length
  for (; i < length; i++) {

    let result = await put(allFiles[i].key, allFiles[i].file)

    let m = allFiles[i].key;

    if (result === true) {
      successCount++;
    } else {
      m = m + ':' + result
      failCount++;
    }
    bar.tick(parseInt(successCount+failCount) / length * 50, {
      atotal: length,
      finished: successCount+failCount,
      file: m,
      failCount:failCount,
    })
  }

  if (!that.delete) {

  } else {

  }
  console.log('完成');
  return;
}


exports = module.exports = AliOSSBatchUpload;
